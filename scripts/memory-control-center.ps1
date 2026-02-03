# AIGestion Memory Control Center
# Centralized control panel for memory management

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Global variables
$MainForm = $null
$StatusLabel = $null
$MemoryLabel = $null
$ProcessCountLabel = $null
$Timer = $null
$LogTextBox = $null

function Create-MemoryControlCenter {
    # Create main form
    $MainForm = New-Object System.Windows.Forms.Form
    $MainForm.Text = "AIGestion Memory Control Center"
    $MainForm.Size = New-Object System.Drawing.Size(800, 600)
    $MainForm.StartPosition = "CenterScreen"
    $MainForm.Icon = [System.Drawing.Icon]::ExtractAssociatedIcon("shell32.dll")
    
    # Create title label
    $TitleLabel = New-Object System.Windows.Forms.Label
    $TitleLabel.Text = "🧠 AIGestion Memory Control Center"
    $TitleLabel.Font = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
    $TitleLabel.ForeColor = [System.Drawing.Color]::DarkBlue
    $TitleLabel.Location = New-Object System.Drawing.Point(20, 20)
    $TitleLabel.Size = New-Object System.Drawing.Size(400, 30)
    $MainForm.Controls.Add($TitleLabel)
    
    # Create status panel
    $StatusPanel = New-Object System.Windows.Forms.GroupBox
    $StatusPanel.Text = "System Status"
    $StatusPanel.Location = New-Object System.Drawing.Point(20, 70)
    $StatusPanel.Size = New-Object System.Drawing.Size(360, 120)
    $MainForm.Controls.Add($StatusPanel)
    
    # Memory label
    $MemoryLabel = New-Object System.Windows.Forms.Label
    $MemoryLabel.Text = "Memory: Calculating..."
    $MemoryLabel.Location = New-Object System.Drawing.Point(10, 25)
    $MemoryLabel.Size = New-Object System.Drawing.Size(340, 20)
    $StatusPanel.Controls.Add($MemoryLabel)
    
    # Process count label
    $ProcessCountLabel = New-Object System.Windows.Forms.Label
    $ProcessCountLabel.Text = "Processes: Calculating..."
    $ProcessCountLabel.Location = New-Object System.Drawing.Point(10, 50)
    $ProcessCountLabel.Size = New-Object System.Drawing.Size(340, 20)
    $StatusPanel.Controls.Add($ProcessCountLabel)
    
    # Status label
    $StatusLabel = New-Object System.Windows.Forms.Label
    $StatusLabel.Text = "Status: Initializing..."
    $StatusLabel.Location = New-Object System.Drawing.Point(10, 75)
    $StatusLabel.Size = New-Object System.Drawing.Size(340, 20)
    $StatusPanel.Controls.Add($StatusLabel)
    
    # Create control panel
    $ControlPanel = New-Object System.Windows.Forms.GroupBox
    $ControlPanel.Text = "Quick Actions"
    $ControlPanel.Location = New-Object System.Drawing.Point(400, 70)
    $ControlPanel.Size = New-Object System.Drawing.Size(360, 120)
    $MainForm.Controls.Add($ControlPanel)
    
    # Refresh button
    $RefreshButton = New-Object System.Windows.Forms.Button
    $RefreshButton.Text = "🔄 Refresh Status"
    $RefreshButton.Location = New-Object System.Drawing.Point(10, 25)
    $RefreshButton.Size = New-Object System.Drawing.Size(160, 30)
    $RefreshButton.Add_Click({
        Update-MemoryStatus
    })
    $ControlPanel.Controls.Add($RefreshButton)
    
    # Optimize button
    $OptimizeButton = New-Object System.Windows.Forms.Button
    $OptimizeButton.Text = "⚡ Optimize Memory"
    $OptimizeButton.Location = New-Object System.Drawing.Point(180, 25)
    $OptimizeButton.Size = New-Object System.Drawing.Size(160, 30)
    $OptimizeButton.BackColor = [System.Drawing.Color]::LightGreen
    $OptimizeButton.Add_Click({
        Optimize-Memory
    })
    $ControlPanel.Controls.Add($OptimizeButton)
    
    # Kill processes button
    $KillButton = New-Object System.Windows.Forms.Button
    $KillButton.Text = "🗑️ Kill High Memory"
    $KillButton.Location = New-Object System.Drawing.Point(10, 65)
    $KillButton.Size = New-Object System.Drawing.Size(160, 30)
    $KillButton.BackColor = [System.Drawing.Color]::LightCoral
    $KillButton.Add_Click({
        Kill-HighMemoryProcesses
    })
    $ControlPanel.Controls.Add($KillButton)
    
    # Auto-manager button
    $AutoButton = New-Object System.Windows.Forms.Button
    $AutoButton.Text = "🤖 Auto Manager"
    $AutoButton.Location = New-Object System.Drawing.Point(180, 65)
    $AutoButton.Size = New-Object System.Drawing.Size(160, 30)
    $AutoButton.BackColor = [System.Drawing.Color]::LightBlue
    $AutoButton.Add_Click({
        Start-AutoManager
    })
    $ControlPanel.Controls.Add($AutoButton)
    
    # Create log panel
    $LogPanel = New-Object System.Windows.Forms.GroupBox
    $LogPanel.Text = "Activity Log"
    $LogPanel.Location = New-Object System.Drawing.Point(20, 200)
    $LogPanel.Size = New-Object System.Drawing.Size(740, 320)
    $MainForm.Controls.Add($LogPanel)
    
    # Log text box
    $LogTextBox = New-Object System.Windows.Forms.TextBox
    $LogTextBox.Multiline = $true
    $LogTextBox.ScrollBars = "Vertical"
    $LogTextBox.Location = New-Object System.Drawing.Point(10, 25)
    $LogTextBox.Size = New-Object System.Drawing.Size(720, 280)
    $LogTextBox.Font = New-Object System.Drawing.Font("Consolas", 9)
    $LogTextBox.BackColor = [System.Drawing.Color]::Black
    $LogTextBox.ForeColor = [System.Drawing.Color]::LightGreen
    $LogPanel.Controls.Add($LogTextBox)
    
    # Create timer for auto-refresh
    $Timer = New-Object System.Windows.Forms.Timer
    $Timer.Interval = 5000  # 5 seconds
    $Timer.Add_Tick({
        Update-MemoryStatus
    })
    
    # Add initial log entry
    Add-LogEntry "AIGestion Memory Control Center initialized"
    Add-LogEntry "Auto-refresh enabled (5 seconds)"
    
    # Initial status update
    Update-MemoryStatus
    
    # Start timer
    $Timer.Start()
    
    return $MainForm
}

function Update-MemoryStatus {
    try {
        $processes = Get-Process -Name node -ErrorAction SilentlyContinue
        
        if ($processes) {
            $totalMemory = ($processes | Measure-Object -Property WorkingSet -Sum).Sum / 1MB
            $processCount = $processes.Count
            
            $MemoryLabel.Text = "Memory: $([math]::Round($totalMemory, 2)) MB"
            $ProcessCountLabel.Text = "Processes: $processCount"
            
            if ($totalMemory -gt 1000) {
                $MemoryLabel.ForeColor = [System.Drawing.Color]::Red
                $StatusLabel.Text = "Status: ⚠️ High Memory Usage"
                $StatusLabel.ForeColor = [System.Drawing.Color]::Red
            } elseif ($totalMemory -gt 500) {
                $MemoryLabel.ForeColor = [System.Drawing.Color]::Orange
                $StatusLabel.Text = "Status: ⚡ Moderate Usage"
                $StatusLabel.ForeColor = [System.Drawing.Color]::Orange
            } else {
                $MemoryLabel.ForeColor = [System.Drawing.Color]::Green
                $StatusLabel.Text = "Status: ✅ Optimal"
                $StatusLabel.ForeColor = [System.Drawing.Color]::Green
            }
        } else {
            $MemoryLabel.Text = "Memory: 0 MB"
            $ProcessCountLabel.Text = "Processes: 0"
            $StatusLabel.Text = "Status: ℹ️ No Node.js Processes"
            $StatusLabel.ForeColor = [System.Drawing.Color]::Blue
        }
        
        $MainForm.Text = "AIGestion Memory Control Center - $(Get-Date -Format 'HH:mm:ss')"
        
    } catch {
        $MemoryLabel.Text = "Error: $($_.Exception.Message)"
        $StatusLabel.Text = "Status: ❌ Error"
        $StatusLabel.ForeColor = [System.Drawing.Color]::Red
    }
}

function Optimize-Memory {
    Add-LogEntry "🧹 Starting memory optimization..."
    
    try {
        # Clear system memory
        [System.GC]::Collect()
        [System.GC]::WaitForPendingFinalizers()
        [System.GC]::Collect()
        
        Add-LogEntry "✅ Memory optimization completed"
        Update-MemoryStatus
        
    } catch {
        Add-LogEntry "❌ Optimization failed: $($_.Exception.Message)"
    }
}

function Kill-HighMemoryProcesses {
    Add-LogEntry "🗑️ Checking for high memory processes..."
    
    try {
        $processes = Get-Process -Name node -ErrorAction SilentlyContinue
        $highMemory = $processes | Where-Object { $_.WorkingSet / 1MB -gt 200 }
        
        if ($highMemory) {
            Add-LogEntry "Found $($highMemory.Count) high memory processes"
            
            $highMemory | ForEach-Object {
                $memoryMB = [math]::Round($_.WorkingSet/1MB, 2)
                Add-LogEntry "Killing PID $($_.Id): $memoryMB MB"
                Stop-Process -Id $_.Id -Force
            }
            
            Add-LogEntry "✅ Process cleanup completed"
            Update-MemoryStatus
            
        } else {
            Add-LogEntry "ℹ️ No high memory processes found"
        }
        
    } catch {
        Add-LogEntry "❌ Process cleanup failed: $($_.Exception.Message)"
    }
}

function Start-AutoManager {
    Add-LogEntry "🤖 Starting Auto Memory Manager..."
    
    try {
        Start-Job -ScriptBlock {
            & "c:\Users\Alejandro\AIGestion\scripts\auto-memory-manager.ps1" -EnableAutoKill
        } -Name "MemoryManager"
        
        Add-LogEntry "✅ Auto Memory Manager started in background"
        
    } catch {
        Add-LogEntry "❌ Failed to start Auto Manager: $($_.Exception.Message)"
    }
}

function Add-LogEntry {
    param([string]$Message)
    $timestamp = Get-Date -Format "HH:mm:ss"
    $LogTextBox.AppendText("[$timestamp] $Message`r`n")
    $LogTextBox.ScrollToCaret()
}

# Create and show the control center
$MainForm = Create-MemoryControlCenter
$MainForm.ShowDialog() | Out-Null
