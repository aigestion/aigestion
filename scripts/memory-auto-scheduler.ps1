# AIGestion Memory Auto-Scheduler
# Automates memory management with Windows Task Scheduler

param(
    [switch]$Install,
    [switch]$Uninstall,
    [switch]$Test,
    [switch]$Status
)

# Configuration
$TaskName = "AIGestion-Memory-Manager"
$TaskDescription = "Automated memory management for AIGestion backend"
$ScriptPath = "c:\Users\Alejandro\AIGestion\scripts\auto-memory-manager.ps1"
$LogFile = "c:\Users\Alejandro\AIGestion\logs\memory-scheduler.log"

# Ensure log directory exists
$logDir = Split-Path $LogFile -Parent
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path $LogFile -Value $logEntry
    
    switch ($Level) {
        "ERROR" { Write-Host $logEntry -ForegroundColor Red }
        "WARN"  { Write-Host $logEntry -ForegroundColor Yellow }
        "INFO"  { Write-Host $logEntry -ForegroundColor Green }
        "SUCCESS" { Write-Host $logEntry -ForegroundColor Cyan }
        default { Write-Host $logEntry -ForegroundColor Gray }
    }
}

function Install-MemoryTask {
    Write-Log "Installing AIGestion Memory Manager task..." "INFO"
    
    try {
        # Check if task already exists
        $existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        
        if ($existingTask) {
            Write-Log "Task already exists. Removing old task first..." "WARN"
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        }
        
        # Create task action
        $action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$ScriptPath`" -EnableAutoKill"
        
        # Create trigger (run every 5 minutes)
        $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5)
        
        # Create settings
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable
        
        # Register the task
        Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description $TaskDescription -RunLevel Highest -User (whoami) | Out-Null
        
        Write-Log "Task installed successfully!" "SUCCESS"
        Write-Log "Task will run every 5 minutes with auto-kill enabled" "INFO"
        Write-Log "Script path: $ScriptPath" "INFO"
        
        # Start the task immediately
        Start-ScheduledTask -TaskName $TaskName
        Write-Log "Task started immediately" "INFO"
        
    } catch {
        Write-Log "Failed to install task: $($_.Exception.Message)" "ERROR"
        return $false
    }
    
    return $true
}

function Uninstall-MemoryTask {
    Write-Log "Uninstalling AIGestion Memory Manager task..." "INFO"
    
    try {
        $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        
        if ($task) {
            # Stop the task if running
            Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
            
            # Unregister the task
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
            Write-Log "Task uninstalled successfully" "SUCCESS"
        } else {
            Write-Log "Task not found" "WARN"
        }
        
    } catch {
        Write-Log "Failed to uninstall task: $($_.Exception.Message)" "ERROR"
        return $false
    }
    
    return $true
}

function Get-TaskStatus {
    Write-Log "Checking AIGestion Memory Manager task status..." "INFO"
    
    try {
        $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        
        if ($task) {
            Write-Host "=== TASK STATUS ===" -ForegroundColor Cyan
            Write-Host "Task Name: $($task.TaskName)" -ForegroundColor Green
            Write-Host "Description: $($task.Description)" -ForegroundColor Gray
            Write-Host "State: $($task.State)" -ForegroundColor Yellow
            
            # Get last run time
            $taskInfo = Get-ScheduledTaskInfo -TaskName $TaskName
            Write-Host "Last Run: $($taskInfo.LastRunTime)" -ForegroundColor Gray
            Write-Host "Next Run: $($taskInfo.NextRunTime)" -ForegroundColor Gray
            
            # Check if task is enabled
            if ($task.Settings.Enabled) {
                Write-Host "Status: ENABLED" -ForegroundColor Green
            } else {
                Write-Host "Status: DISABLED" -ForegroundColor Red
            }
            
            Write-Host ""
            Write-Host "Recent log entries:" -ForegroundColor Yellow
            $recentLogs = Get-Content $LogFile | Select-Object -Last 5
            $recentLogs | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
            
        } else {
            Write-Host "Task '$TaskName' not found" -ForegroundColor Red
            Write-Host "Run with -Install to create the task" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Log "Failed to get task status: $($_.Exception.Message)" "ERROR"
    }
}

function Test-MemoryTask {
    Write-Log "Testing AIGestion Memory Manager..." "INFO"
    
    try {
        # Check if script exists
        if (-not (Test-Path $ScriptPath)) {
            Write-Log "Script not found: $ScriptPath" "ERROR"
            return $false
        }
        
        Write-Log "Running memory manager test (30 seconds)..." "INFO"
        
        # Run the memory manager for 30 seconds
        $job = Start-Job -ScriptBlock {
            param($ScriptPath)
            & PowerShell.exe -ExecutionPolicy Bypass -File $ScriptPath -EnableAutoKill
        } -ArgumentList $ScriptPath
        
        # Wait for 30 seconds
        Start-Sleep -Seconds 30
        
        # Stop the job
        Stop-Job -Job $job -PassThru | Remove-Job
        
        Write-Log "Test completed successfully" "SUCCESS"
        Write-Log "Check the log file for details: $LogFile" "INFO"
        
    } catch {
        Write-Log "Test failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
    
    return $true
}

# Main execution
Write-Host "AIGestion Memory Auto-Scheduler" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Gray

if ($Install) {
    Write-Host "Installing automated memory management..." -ForegroundColor Green
    if (Install-MemoryTask) {
        Write-Host "✅ Installation complete!" -ForegroundColor Green
        Write-Host "The system will now automatically manage memory every 5 minutes" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Installation failed!" -ForegroundColor Red
    }
}
elseif ($Uninstall) {
    Write-Host "Uninstalling automated memory management..." -ForegroundColor Yellow
    if (Uninstall-MemoryTask) {
        Write-Host "✅ Uninstallation complete!" -ForegroundColor Green
    } else {
        Write-Host "❌ Uninstallation failed!" -ForegroundColor Red
    }
}
elseif ($Test) {
    Write-Host "Testing memory management system..." -ForegroundColor Yellow
    if (Test-MemoryTask) {
        Write-Host "✅ Test completed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Test failed!" -ForegroundColor Red
    }
}
elseif ($Status) {
    Get-TaskStatus
}
else {
    Write-Host "Usage:" -ForegroundColor Gray
    Write-Host "  Install:    .\memory-auto-scheduler.ps1 -Install" -ForegroundColor Cyan
    Write-Host "  Uninstall:  .\memory-auto-scheduler.ps1 -Uninstall" -ForegroundColor Cyan
    Write-Host "  Test:       .\memory-auto-scheduler.ps1 -Test" -ForegroundColor Cyan
    Write-Host "  Status:     .\memory-auto-scheduler.ps1 -Status" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Gray
    Write-Host "  # Install automated memory management" -ForegroundColor Gray
    Write-Host "  .\memory-auto-scheduler.ps1 -Install" -ForegroundColor Green
    Write-Host ""
    Write-Host "  # Check current status" -ForegroundColor Gray
    Write-Host "  .\memory-auto-scheduler.ps1 -Status" -ForegroundColor Green
    Write-Host ""
    Write-Host "  # Test the system" -ForegroundColor Gray
    Write-Host "  .\memory-auto-scheduler.ps1 -Test" -ForegroundColor Green
}

Write-Host ""
