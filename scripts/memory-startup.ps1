# AIGestion Memory Management - Startup Script
# Automatically starts memory management on Windows startup

param(
    [switch]$Install,
    [switch]$Uninstall,
    [switch]$Status
)

$TaskName = "AIGestion-Memory-Startup"
$ScriptPath = "c:\Users\Alejandro\AIGestion\scripts\auto-memory-manager.ps1"
$LogFile = "c:\Users\Alejandro\AIGestion\logs\memory-startup.log"

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

function Install-StartupTask {
    Write-Log "Installing AIGestion Memory startup task..." "INFO"
    
    try {
        # Check if task already exists
        $existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        
        if ($existingTask) {
            Write-Log "Startup task already exists. Removing old task first..." "WARN"
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        }
        
        # Create task action
        $action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`" -EnableAutoKill"
        
        # Create trigger (run at user logon)
        $trigger = New-ScheduledTaskTrigger -AtLogOn -User (whoami)
        
        # Create settings
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -Hidden
        
        # Register the task
        Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description "AIGestion Memory Management - Auto-start at login" -RunLevel Highest | Out-Null
        
        Write-Log "Startup task installed successfully!" "SUCCESS"
        Write-Log "Memory management will start automatically at user login" "INFO"
        
    } catch {
        Write-Log "Failed to install startup task: $($_.Exception.Message)" "ERROR"
        return $false
    }
    
    return $true
}

function Uninstall-StartupTask {
    Write-Log "Uninstalling AIGestion Memory startup task..." "INFO"
    
    try {
        $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        
        if ($task) {
            Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
            Write-Log "Startup task uninstalled successfully" "SUCCESS"
        } else {
            Write-Log "Startup task not found" "WARN"
        }
        
    } catch {
        Write-Log "Failed to uninstall startup task: $($_.Exception.Message)" "ERROR"
        return $false
    }
    
    return $true
}

function Get-StartupStatus {
    Write-Log "Checking AIGestion Memory startup status..." "INFO"
    
    try {
        $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        
        if ($task) {
            Write-Host "=== STARTUP TASK STATUS ===" -ForegroundColor Cyan
            Write-Host "Task Name: $($task.TaskName)" -ForegroundColor Green
            Write-Host "Description: $($task.Description)" -ForegroundColor Gray
            Write-Host "State: $($task.State)" -ForegroundColor Yellow
            
            $taskInfo = Get-ScheduledTaskInfo -TaskName $TaskName
            Write-Host "Last Run: $($taskInfo.LastRunTime)" -ForegroundColor Gray
            Write-Host "Next Run: $($taskInfo.NextRunTime)" -ForegroundColor Gray
            
            if ($task.Settings.Enabled) {
                Write-Host "Status: ENABLED (will start at login)" -ForegroundColor Green
            } else {
                Write-Host "Status: DISABLED" -ForegroundColor Red
            }
            
        } else {
            Write-Host "Startup task '$TaskName' not found" -ForegroundColor Red
            Write-Host "Run with -Install to create the startup task" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Log "Failed to get startup status: $($_.Exception.Message)" "ERROR"
    }
}

# Main execution
Write-Host "AIGestion Memory Startup Manager" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Gray

if ($Install) {
    Write-Host "Installing startup memory management..." -ForegroundColor Green
    if (Install-StartupTask) {
        Write-Host "✅ Startup installation complete!" -ForegroundColor Green
        Write-Host "Memory management will now start automatically when you log in" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Startup installation failed!" -ForegroundColor Red
    }
}
elseif ($Uninstall) {
    Write-Host "Uninstalling startup memory management..." -ForegroundColor Yellow
    if (Uninstall-StartupTask) {
        Write-Host "✅ Startup uninstallation complete!" -ForegroundColor Green
    } else {
        Write-Host "❌ Startup uninstallation failed!" -ForegroundColor Red
    }
}
elseif ($Status) {
    Get-StartupStatus
}
else {
    Write-Host "Usage:" -ForegroundColor Gray
    Write-Host "  Install:   .\memory-startup.ps1 -Install" -ForegroundColor Cyan
    Write-Host "  Uninstall: .\memory-startup.ps1 -Uninstall" -ForegroundColor Cyan
    Write-Host "  Status:    .\memory-startup.ps1 -Status" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Gray
    Write-Host "  # Install auto-start" -ForegroundColor Gray
    Write-Host "  .\memory-startup.ps1 -Install" -ForegroundColor Green
    Write-Host ""
    Write-Host "  # Check startup status" -ForegroundColor Gray
    Write-Host "  .\memory-startup.ps1 -Status" -ForegroundColor Green
}

Write-Host ""
