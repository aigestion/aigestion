<#
.SYNOPSIS
    Install-Guardian - Registers NexusWatcher as a Windows Scheduled Task
    Part of the Nexus Guardian V2 System.

.DESCRIPTION
    Automates the "Always-On" guardian by creating a Windows Scheduled Task:
    - Runs at User Logon
    - Executes NexusWatcher.ps1 in a hidden window
    - Sets High Priority
    - Ensures only one instance runs

.EXAMPLE
    .\Install-Guardian.ps1
#>

$ErrorActionPreference = "Stop"
$RootPath = "C:\Users\Alejandro\AIGestion"
$OpsPath = Join-Path $RootPath "ops"
$WatcherScript = Join-Path $OpsPath "NexusWatcher.ps1"
$TaskName = "AIGestion_Nexus_Guardian"

function Get-CurrentUser {
    return [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  NEXUS GUARDIAN: STARTUP AUTOMATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $WatcherScript)) {
    Write-Host "[ERROR] Watcher script not found at $WatcherScript" -ForegroundColor Red
    exit 1
}

try {
    Write-Host ">> Registering Scheduled Task: $TaskName" -ForegroundColor Yellow

    # Define the action: Start powershell with hidden window
    # We use -WindowStyle Hidden to keep it in the background
    $Action = New-ScheduledTaskAction -Execute "powershell.exe" `
        -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File ""$WatcherScript""" `
        -WorkingDirectory $RootPath

    # Define the trigger: At logon
    $Trigger = New-ScheduledTaskTrigger -AtLogOn

    # Define principal: Run as current user with Highest privileges
    $Principal = New-ScheduledTaskPrincipal -UserId (Get-CurrentUser) -LogonType Interactive -RunLevel Highest

    # Define settings
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -Priority 4

    # Register the task
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Principal $Principal -Settings $Settings -Force | Out-Null

    Write-Host "[OK] Nexus Guardian scheduled task created successfully." -ForegroundColor Green
    Write-Host "     The watcher will now start automatically every time you log in." -ForegroundColor DarkGray
    Write-Host ""
    Write-Host ">> Starting the watcher now..." -ForegroundColor Cyan
    Start-ScheduledTask -TaskName $TaskName
    Write-Host "[OK] Watcher is now running in the background." -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Failed to register task: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "        Note: You may need to run this script as Administrator." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "------------------------------------------------------------" -ForegroundColor Cyan
Write-Host "Stay Sovereign, Alejandro." -ForegroundColor Cyan
Write-Host ""
