<#
.SYNOPSIS
    THE NEXUS RITUAL (GOD MODE)
    Master Orchestration Script for AIGestion
    Version: 1.0.0

.DESCRIPTION
    The ultimate startup ritual that ensures a healthy and optimized environment:
    1. Runs the Nexus Doctor (Diagnostics & Healing).
    2. Triggers GodMode (Resource Recovery).
    3. Launches the Desktop Orchestrator.
    4. Verifies Mobile Device Connectivity.
#>

param(
    [switch]$SkipHealing,
    [switch]$SkipGodMode,
    [switch]$SkipDevEnv
)

$RootPath = "C:\Users\Alejandro\AIGestion"
$OpsPath = Join-Path $RootPath "ops"

function Write-RitualTitle {
    Clear-Host
    Write-Host "`n" + ("*" * 70) -ForegroundColor Magenta
    Write-Host "   🌌 THE NEXUS RITUAL: SOVEREIGN INITIATION" -ForegroundColor Magenta
    Write-Host ("*" * 70) + "`n" -ForegroundColor Magenta
}

Write-RitualTitle

# 1. Nexus Doctor
Write-Host ">> STEP 1: INVOKING NEXUS DOCTOR..." -ForegroundColor Yellow
$doctor = Join-Path $OpsPath "NexusDoctor.ps1"
if (Test-Path $doctor) {
    if ($SkipHealing) { & $doctor -DryRun }
    else { & $doctor -Fix }
} else {
    Write-Host "   [ERROR] NexusDoctor.ps1 not found!" -ForegroundColor Red
}

Write-Host "`n>> STEP 2: HARDENING RESOURCES..." -ForegroundColor Yellow
if (-not $SkipGodMode) {
    $godMode = Join-Path $OpsPath "GodMode.ps1"
    if (Test-Path $godMode) {
        & $godMode
    }
} else {
    Write-Host "   [SKIP] GodMode manual bypass." -ForegroundColor Gray
}

Write-Host "`n>> STEP 3: ORCHESTRATING DEVELOPMENT DESKTOP..." -ForegroundColor Yellow
if (-not $SkipDevEnv) {
    $devSetup = Join-Path $OpsPath "DevDesktopSetup.ps1"
    if (Test-Path $devSetup) {
        & $devSetup
    }
} else {
    Write-Host "   [SKIP] Desktop Setup manual bypass." -ForegroundColor Gray
}

Write-Host "`n>> STEP 4: MOBILE READINESS CHECK..." -ForegroundColor Yellow
$adbStatus = adb devices 2>$null
if ($adbStatus -match "device$") {
    Write-Host "   [ OK ] Pixel 8 Pro is READY for deployment." -ForegroundColor Green
} else {
    Write-Host "   [ WARN ] Pixel 8 Pro NOT DETECTED. Connect device for mobile dev." -ForegroundColor Yellow
}

Write-Host "`n" + ("*" * 70) -ForegroundColor Magenta
Write-Host "   RITUAL COMPLETE. SYSTEM STATUS: DIVINE." -ForegroundColor Magenta
Write-Host ("*" * 70) + "`n" -ForegroundColor Magenta

$launchConsole = Read-Host "Initiate Quantum Nexus Console? (y/n)"
if ($launchConsole -eq 'y') {
    & "$OpsPath\NexusConsole.ps1"
} else {
    Write-Host "Stay Sovereign, Alejandro.`n" -ForegroundColor Cyan
}
