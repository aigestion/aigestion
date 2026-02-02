# Scheduled Task for Automatic Memory Management
# Creates Windows Scheduled Task for continuous monitoring

param(
    [switch]$CreateTask,
    [switch]$RemoveTask,
    [switch]$EnableAutoKill,
    [string]$TaskName = "AIGestionMemoryManager"
)

$TaskDescription = "Automatic memory management for AIGestion Node.js processes"
$ScriptPath = "c:\Users\Alejandro\AIGestion\scripts\auto-memory-manager.ps1"
$PowerShellPath = (Get-Command powershell.exe).Source

function New-MemoryManagerTask {
    Write-Host "Creating scheduled task: $TaskName" -ForegroundColor Green

    # Check if task already exists
    $existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($existingTask) {
        Write-Host "Task already exists. Removing first..." -ForegroundColor Yellow
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    }

    # Build arguments
    $arguments = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`"$ScriptPath`"")
    if ($EnableAutoKill) {
        $arguments += "-EnableAutoKill"
    }

    # Create trigger (start at boot and repeat every 10 minutes)
    $triggerBoot = New-ScheduledTaskTrigger -AtStartup
    $startTime = (Get-Date).AddMinutes(1).ToString("HH:mm:ss")
    $triggerRepeat = New-ScheduledTaskTrigger -Daily -At $startTime

    # Create action
    $action = New-ScheduledTaskAction -Execute $PowerShellPath -Argument ($arguments -join " ")

    # Create settings
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable -DontStopOnIdleEnd

    # Register task
    try {
        Register-ScheduledTask -TaskName $TaskName -Description $TaskDescription -Trigger $triggerBoot, $triggerRepeat -Action $action -Settings $settings -RunLevel Highest -User "SYSTEM"
        Write-Host "✅ Scheduled task created successfully!" -ForegroundColor Green
        Write-Host "Task will start at boot and check every 10 minutes" -ForegroundColor Gray
        Write-Host "Auto-kill enabled: $EnableAutoKill" -ForegroundColor Gray
    }
    catch {
        Write-Host "❌ Failed to create scheduled task: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Remove-MemoryManagerTask {
    Write-Host "Removing scheduled task: $TaskName" -ForegroundColor Yellow

    try {
        $existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        if ($existingTask) {
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
            Write-Host "✅ Scheduled task removed successfully!" -ForegroundColor Green
        }
        else {
            Write-Host "No task found with name: $TaskName" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ Failed to remove scheduled task: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Get-TaskStatus {
    Write-Host "Checking task status: $TaskName" -ForegroundColor Cyan

    try {
        $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        if ($task) {
            Write-Host "Task found:" -ForegroundColor Green
            Write-Host "  Name: $($task.TaskName)"
            Write-Host "  Description: $($task.Description)"
            Write-Host "  State: $($task.State)"
            Write-Host "  Triggers: $($task.Triggers.Count)"

            $task.Triggers | ForEach-Object {
                Write-Host "    - $($_.GetType().Name): $($_.StartBoundary)"
            }
        }
        else {
            Write-Host "No task found with name: $TaskName" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ Failed to get task status: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution
Write-Host "AIGestion Memory Manager - Scheduled Task Configuration" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Gray

if ($CreateTask) {
    New-MemoryManagerTask
}
elseif ($RemoveTask) {
    Remove-MemoryManagerTask
}
else {
    Get-TaskStatus
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Gray
    Write-Host "  Create task:  .\setup-memory-task.ps1 -CreateTask" -ForegroundColor Gray
    Write-Host "  Create with auto-kill:  .\setup-memory-task.ps1 -CreateTask -EnableAutoKill" -ForegroundColor Gray
    Write-Host "  Remove task:  .\setup-memory-task.ps1 -RemoveTask" -ForegroundColor Gray
}
