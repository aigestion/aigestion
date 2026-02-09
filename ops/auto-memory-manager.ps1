# Auto-Memory Management Script for AIGestion Backend
# Automatically manages Node.js processes based on memory thresholds

param(
    [switch]$EnableAutoKill,
    [int]$MaxMemoryPerProcess = 1536,
    [int]$MaxTotalMemory = 4096,
    [int]$MaxProcessCount = 15,
    [int]$CheckInterval = 10
)

# Configuration
$Config = @{
    MaxMemoryPerProcess = $MaxMemoryPerProcess
    MaxTotalMemory = $MaxTotalMemory
    MaxProcessCount = $MaxProcessCount
    CheckInterval = $CheckInterval
    EnableAutoKill = $EnableAutoKill
    LogFile = "c:\Users\Alejandro\AIGestion\logs\memory-manager.log"
}

# Ensure log directory exists
$logDir = Split-Path $Config.LogFile -Parent
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path $Config.LogFile -Value $logEntry

    # Also output to console with colors
    switch ($Level) {
        "ERROR" { Write-Host $logEntry -ForegroundColor Red }
        "WARN"  { Write-Host $logEntry -ForegroundColor Yellow }
        "INFO"  { Write-Host $logEntry -ForegroundColor Green }
        default { Write-Host $logEntry -ForegroundColor Gray }
    }
}

function Get-NodeProcesses {
    try {
        return Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object {
            [PSCustomObject]@{
                Process = $_
                PID = $_.Id
                MemoryMB = [math]::Round($_.WorkingSet / 1MB, 2)
                StartTime = $_.StartTime
                CPU = $_.CPU
                ShouldKill = $false
                KillReason = ""
            }
        }
    } catch {
        Write-Log "Error getting Node.js processes: $($_.Exception.Message)" "ERROR"
        return @()
    }
}

function Test-MemoryThresholds {
    param($Processes)

    $totalMemory = ($Processes | Measure-Object -Property MemoryMB -Sum).Sum
    $processCount = $Processes.Count

    Write-Log "Memory check: $processCount processes, $([math]::Round($totalMemory, 2)) MB total"

    $actions = @()

    # Check individual process memory
    $Processes | ForEach-Object {
        if ($_.MemoryMB -gt $Config.MaxMemoryPerProcess) {
            $_.ShouldKill = $true
            $_.KillReason = "High memory: $($_.MemoryMB)MB > $($Config.MaxMemoryPerProcess)MB"
            $actions += "Process $($_.PID) exceeds memory limit ($($_.MemoryMB)MB)"
        }
    }

    # Check total memory
    if ($totalMemory -gt $Config.MaxTotalMemory) {
        # Sort by memory usage (highest first) and mark for killing until under threshold
        $sortedProcesses = $Processes | Sort-Object -Property MemoryMB -Descending
        $currentTotal = $totalMemory

        foreach ($proc in $sortedProcesses) {
            if ($currentTotal -le $Config.MaxTotalMemory) { break }
            if (-not $proc.ShouldKill) {
                $proc.ShouldKill = $true
                $proc.KillReason = "Total memory reduction: $([math]::Round($currentTotal, 2))MB > $($Config.MaxTotalMemory)MB"
                $currentTotal -= $proc.MemoryMB
                $actions += "Process $($_.PID) marked for total memory reduction"
            }
        }
    }

    # Check process count
    if ($processCount -gt $Config.MaxProcessCount) {
        # Sort by memory usage (lowest first) and kill until under threshold
        $sortedProcesses = $Processes | Sort-Object -Property MemoryMB
        $processesToKill = $processCount - $Config.MaxProcessCount

        for ($i = 0; $i -lt $processesToKill; $i++) {
            $proc = $sortedProcesses[$i]
            if (-not $proc.ShouldKill) {
                $proc.ShouldKill = $true
                $proc.KillReason = "Too many processes: $processCount > $($Config.MaxProcessCount)"
                $actions += "Process $($_.PID) marked for process count reduction"
            }
        }
    }

    if ($actions.Count -gt 0) {
        Write-Log "Actions needed: $($actions.Count)" "WARN"
        $actions | ForEach-Object { Write-Log "  - $_" "WARN" }
    } else {
        Write-Log "All memory thresholds within limits"
    }

    return $Processes
}

function Invoke-ProcessCleanup {
    param($Processes)

    $processesToKill = $Processes | Where-Object { $_.ShouldKill }

    if ($processesToKill.Count -eq 0) {
        Write-Log "No processes need cleanup"
        return
    }

    if (-not $Config.EnableAutoKill) {
        Write-Log "Auto-kill disabled. Would kill $($processesToKill.Count) processes:" "WARN"
        $processesToKill | ForEach-Object {
            Write-Log "  - PID $($_.PID): $($_.MemoryMB)MB ($($_.KillReason))" "WARN"
        }
        return
    }

    Write-Log "Starting cleanup of $($processesToKill.Count) processes" "WARN"

    $processesToKill | ForEach-Object {
        try {
            Write-Log "Killing PID $($_.PID): $($_.MemoryMB)MB - $($_.KillReason)" "WARN"
            Stop-Process -Id $_.PID -Force
            Write-Log "Successfully killed PID $($_.PID)"
        } catch {
            Write-Log "Failed to kill PID $($_.PID): $($_.Exception.Message)" "ERROR"
        }
    }
}

function Start-AutoMemoryManager {
    Write-Log "Starting Auto Memory Manager" "INFO"
    Write-Log "Configuration: MaxMemoryPerProcess=$($Config.MaxMemoryPerProcess)MB, MaxTotalMemory=$($Config.MaxTotalMemory)MB, MaxProcessCount=$($Config.MaxProcessCount)"
    Write-Log "AutoKill: $($Config.EnableAutoKill), CheckInterval: $($Config.CheckInterval)s"

    try {
        while ($true) {
            $processes = Get-NodeProcesses

            if ($processes.Count -gt 0) {
                $evaluatedProcesses = Test-MemoryThresholds -Processes $processes
                Invoke-ProcessCleanup -Processes $evaluatedProcesses
            } else {
                Write-Log "No Node.js processes found"
            }

            Write-Log "Next check in $($Config.CheckInterval) seconds..."
            Start-Sleep -Seconds $Config.CheckInterval
        }
    } catch [System.Management.Automation.HaltCommandException] {
        Write-Log "Auto Memory Manager stopped by user" "INFO"
    } catch {
        Write-Log "Auto Memory Manager error: $($_.Exception.Message)" "ERROR"
    }
}

# Main execution
Write-Host "AIGestion Auto Memory Manager" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Gray

if ($EnableAutoKill) {
    Write-Host "⚠️  AUTO-KILL ENABLED - Processes will be terminated automatically!" -ForegroundColor Red
    Write-Host ""
}

Start-AutoMemoryManager
