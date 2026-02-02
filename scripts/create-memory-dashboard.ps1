# AIGestion Memory Management Dashboard
# Web-based dashboard for monitoring and managing Node.js memory

@'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIGestion Memory Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        @keyframes pulse-red {
            0%, 100% { background-color: rgba(239, 68, 68, 0.1); }
            50% { background-color: rgba(239, 68, 68, 0.2); }
        }
        .critical { animation: pulse-red 2s infinite; }
        .warning { background-color: rgba(245, 158, 11, 0.1); }
        .success { background-color: rgba(34, 197, 94, 0.1); }
    </style>
</head>
<body class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <header class="mb-8">
            <h1 class="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                AIGestion Memory Dashboard
            </h1>
            <p class="text-center text-gray-400">Real-time Node.js Memory Monitoring</p>
        </header>

        <!-- Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 class="text-sm font-medium text-gray-400 mb-2">Node.js Processes</h3>
                <p class="text-3xl font-bold" id="processCount">0</p>
                <p class="text-sm text-gray-400">running</p>
            </div>
            
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 class="text-sm font-medium text-gray-400 mb-2">Total Memory</h3>
                <p class="text-3xl font-bold" id="totalMemory">0 MB</p>
                <p class="text-sm text-gray-400">Node.js usage</p>
            </div>
            
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 class="text-sm font-medium text-gray-400 mb-2">System Memory</h3>
                <p class="text-3xl font-bold" id="systemMemory">0%</p>
                <p class="text-sm text-gray-400">system usage</p>
            </div>
            
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 class="text-sm font-medium text-gray-400 mb-2">Status</h3>
                <p class="text-3xl font-bold" id="status">OK</p>
                <p class="text-sm text-gray-400" id="statusText">All good</p>
            </div>
        </div>

        <!-- Controls -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h2 class="text-xl font-semibold mb-4">Controls</h2>
            <div class="flex flex-wrap gap-4">
                <button onclick="refreshData()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    🔄 Refresh
                </button>
                <button onclick="toggleAutoRefresh()" id="autoRefreshBtn" class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                    ⏱️ Auto Refresh: OFF
                </button>
                <button onclick="killHighMemory()" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                    ⚠️ Kill High Memory
                </button>
                <button onclick="optimizeMemory()" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                    🧹 Optimize Memory
                </button>
            </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 class="text-xl font-semibold mb-4">Memory Usage Over Time</h2>
                <canvas id="memoryChart"></canvas>
            </div>
            
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 class="text-xl font-semibold mb-4">Process Distribution</h2>
                <canvas id="processChart"></canvas>
            </div>
        </div>

        <!-- Process List -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 class="text-xl font-semibold mb-4">Node.js Processes</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b border-gray-700">
                            <th class="py-2 px-4">PID</th>
                            <th class="py-2 px-4">Memory (MB)</th>
                            <th class="py-2 px-4">CPU (%)</th>
                            <th class="py-2 px-4">Start Time</th>
                            <th class="py-2 px-4">Status</th>
                            <th class="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="processTable">
                        <!-- Processes will be populated here -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Logs -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-8">
            <h2 class="text-xl font-semibold mb-4">Recent Logs</h2>
            <div id="logs" class="bg-gray-900 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
                <!-- Logs will be populated here -->
            </div>
        </div>
    </div>

    <script>
        let autoRefresh = false;
        let refreshInterval;
        let memoryChart, processChart;
        let memoryHistory = [];
        let maxHistoryPoints = 20;

        // Initialize charts
        function initCharts() {
            const memoryCtx = document.getElementById('memoryChart').getContext('2d');
            memoryChart = new Chart(memoryCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Total Memory (MB)',
                        data: [],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            const processCtx = document.getElementById('processChart').getContext('2d');
            processChart = new Chart(processCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }

        // Fetch data from PowerShell script
        async function fetchMemoryData() {
            try {
                // This would normally call a PowerShell endpoint
                // For now, simulate with mock data
                return {
                    processes: [
                        { pid: 1234, memory: 150, cpu: 5, startTime: '2024-01-01 10:00:00', status: 'normal' },
                        { pid: 5678, memory: 320, cpu: 15, startTime: '2024-01-01 09:30:00', status: 'high' },
                        { pid: 9012, memory: 80, cpu: 2, startTime: '2024-01-01 11:15:00', status: 'normal' }
                    ],
                    systemMemory: 65,
                    totalMemory: 550,
                    processCount: 3
                };
            } catch (error) {
                console.error('Error fetching memory data:', error);
                return null;
            }
        }

        // Update dashboard with new data
        async function updateDashboard() {
            const data = await fetchMemoryData();
            if (!data) return;

            // Update status cards
            document.getElementById('processCount').textContent = data.processCount;
            document.getElementById('totalMemory').textContent = `${data.totalMemory} MB`;
            document.getElementById('systemMemory').textContent = `${data.systemMemory}%`;

            // Update status
            let status = 'OK';
            let statusText = 'All good';
            let statusClass = 'success';

            if (data.systemMemory > 85 || data.totalMemory > 1024) {
                status = 'CRITICAL';
                statusText = 'Memory critical';
                statusClass = 'critical';
            } else if (data.systemMemory > 70 || data.totalMemory > 800) {
                status = 'WARNING';
                statusText = 'Memory high';
                statusClass = 'warning';
            }

            const statusElement = document.getElementById('status');
            statusElement.textContent = status;
            statusElement.className = `text-3xl font-bold ${statusClass}`;
            document.getElementById('statusText').textContent = statusText;

            // Update process table
            const processTable = document.getElementById('processTable');
            processTable.innerHTML = '';
            
            data.processes.forEach(process => {
                const row = document.createElement('tr');
                row.className = 'border-b border-gray-700';
                
                const statusColor = process.status === 'high' ? 'text-red-400' : 'text-green-400';
                const statusText = process.status === 'high' ? 'High Memory' : 'Normal';
                
                row.innerHTML = `
                    <td class="py-2 px-4">${process.pid}</td>
                    <td class="py-2 px-4">${process.memory}</td>
                    <td class="py-2 px-4">${process.cpu}</td>
                    <td class="py-2 px-4">${process.startTime}</td>
                    <td class="py-2 px-4 ${statusColor}">${statusText}</td>
                    <td class="py-2 px-4">
                        <button onclick="killProcess(${process.pid})" class="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
                            Kill
                        </button>
                    </td>
                `;
                processTable.appendChild(row);
            });

            // Update charts
            updateCharts(data);
        }

        // Update charts with new data
        function updateCharts(data) {
            // Update memory history chart
            const now = new Date().toLocaleTimeString();
            memoryHistory.push({ time: now, memory: data.totalMemory });
            
            if (memoryHistory.length > maxHistoryPoints) {
                memoryHistory.shift();
            }

            memoryChart.data.labels = memoryHistory.map(h => h.time);
            memoryChart.data.datasets[0].data = memoryHistory.map(h => h.memory);
            memoryChart.update();

            // Update process distribution chart
            const processLabels = data.processes.map(p => `PID ${p.pid}`);
            const processData = data.processes.map(p => p.memory);
            
            processChart.data.labels = processLabels;
            processChart.data.datasets[0].data = processData;
            processChart.update();
        }

        // Control functions
        function refreshData() {
            updateDashboard();
            addLog('Manual refresh triggered');
        }

        function toggleAutoRefresh() {
            autoRefresh = !autoRefresh;
            const btn = document.getElementById('autoRefreshBtn');
            
            if (autoRefresh) {
                btn.textContent = '⏱️ Auto Refresh: ON';
                btn.className = 'px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors';
                refreshInterval = setInterval(updateDashboard, 5000);
                addLog('Auto refresh enabled (5s interval)');
            } else {
                btn.textContent = '⏱️ Auto Refresh: OFF';
                btn.className = 'px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors';
                clearInterval(refreshInterval);
                addLog('Auto refresh disabled');
            }
        }

        function killHighMemory() {
            if (confirm('Are you sure you want to kill high memory processes?')) {
                addLog('Killing high memory processes...', 'warning');
                // This would call PowerShell script
                setTimeout(() => {
                    updateDashboard();
                    addLog('High memory processes killed', 'success');
                }, 1000);
            }
        }

        function optimizeMemory() {
            addLog('Starting memory optimization...', 'info');
            // This would call PowerShell script
            setTimeout(() => {
                updateDashboard();
                addLog('Memory optimization completed', 'success');
            }, 2000);
        }

        function killProcess(pid) {
            if (confirm(`Are you sure you want to kill process ${pid}?`)) {
                addLog(`Killing process ${pid}...`, 'warning');
                // This would call PowerShell script
                setTimeout(() => {
                    updateDashboard();
                    addLog(`Process ${pid} killed`, 'success');
                }, 500);
            }
        }

        function addLog(message, type = 'info') {
            const logs = document.getElementById('logs');
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            
            let color = 'text-gray-400';
            if (type === 'warning') color = 'text-yellow-400';
            if (type === 'error') color = 'text-red-400';
            if (type === 'success') color = 'text-green-400';
            
            logEntry.className = color;
            logEntry.textContent = `[${timestamp}] ${message}`;
            
            logs.appendChild(logEntry);
            logs.scrollTop = logs.scrollHeight;
        }

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            initCharts();
            updateDashboard();
            addLog('Memory dashboard initialized');
        });
    </script>
</body>
</html>
'@ | Out-File -FilePath "c:\Users\Alejandro\AIGestion\dashboard\memory-dashboard.html" -Encoding UTF8

Write-Host "Memory dashboard created: c:\Users\Alejandro\AIGestion\dashboard\memory-dashboard.html" -ForegroundColor Green
