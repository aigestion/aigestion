# Quick Memory Commands for AIGestion
# Easy-to-use shortcuts for memory management

function Show-MemoryStatus {
    param([switch]$Continuous, [int]$Interval = 5)
    
    $scriptPath = "c:\Users\Alejandro\AIGestion\scripts\memory-monitor.ps1"
    
    if ($Continuous) {
        & $scriptPath -Continuous -Interval $Interval
    } else {
        & $scriptPath
    }
}

function Kill-NodeProcesses {
    param([int]$ThresholdMB = 300)
    
    $scriptPath = "c:\Users\Alejandro\AIGestion\scripts\memory-monitor.ps1"
    & $scriptPath -KillHighMemory -MemoryThresholdMB $ThresholdMB
}

function Start-AutoMemoryManager {
    param(
        [switch]$EnableAutoKill,
        [int]$MaxMemoryPerProcess = 300,
        [int]$MaxTotalMemory = 1024,
        [int]$MaxProcessCount = 15,
        [int]$CheckInterval = 10
    )
    
    $scriptPath = "c:\Users\Alejandro\AIGestion\scripts\auto-memory-manager.ps1"
    
    $params = @()
    if ($EnableAutoKill) { $params += "-EnableAutoKill" }
    $params += "-MaxMemoryPerProcess", $MaxMemoryPerProcess
    $params += "-MaxTotalMemory", $MaxTotalMemory
    $params += "-MaxProcessCount", $MaxProcessCount
    $params += "-CheckInterval", $CheckInterval
    
    & $scriptPath @params
}

function Get-MemoryReport {
    $processes = Get-Process -Name node -ErrorAction SilentlyContinue
    
    if (-not $processes) {
        Write-Host "No Node.js processes running" -ForegroundColor Yellow
        return
    }
    
    $totalMemory = ($processes | Measure-Object -Property WorkingSet -Sum).Sum / 1MB
    $processCount = $processes.Count
    
    Write-Host "=== QUICK MEMORY REPORT ===" -ForegroundColor Cyan
    Write-Host "Node.js Processes: $processCount"
    Write-Host "Total Memory: $([math]::Round($totalMemory, 2)) MB"
    Write-Host "Average: $([math]::Round($totalMemory / $processCount, 2)) MB per process"
    
    $highMemory = $processes | Where-Object { $_.WorkingSet / 1MB -gt 300 }
    if ($highMemory) {
        Write-Host "High Memory Processes (>300MB): $($highMemory.Count)" -ForegroundColor Red
        $highMemory | ForEach-Object {
            Write-Host "  PID $($_.Id): $([math]::Round($_.WorkingSet/1MB, 2)) MB" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

function Optimize-Memory {
    Write-Host "🧹 Memory Optimization Started" -ForegroundColor Green
    
    # Kill high memory processes
    Write-Host "Checking for high memory processes..." -ForegroundColor Yellow
    Kill-NodeProcesses -ThresholdMB 400
    
    # Clear system memory (Windows)
    Write-Host "Clearing system memory..." -ForegroundColor Yellow
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    [System.GC]::Collect()
    
    # Show final status
    Write-Host "Final memory status:" -ForegroundColor Green
    Get-MemoryReport
    
    Write-Host "✅ Memory optimization complete!" -ForegroundColor Green
}

# Export functions
Export-ModuleMember -Function Show-MemoryStatus, Kill-NodeProcesses, Start-AutoMemoryManager, Get-MemoryReport, Optimize-Memory

# Aliases for quick access
Set-Alias -Name mem -Value Get-MemoryReport
Set-Alias -Name memkill -Value Kill-NodeProcesses
Set-Alias -Name memauto -Value Start-AutoMemoryManager
Set-Alias -Name memopt -Value Optimize-Memory

Write-Host "AIGestion Memory Module Loaded" -ForegroundColor Cyan
Write-Host "Commands: mem, memkill, memauto, memopt, Show-MemoryStatus" -ForegroundColor Gray
