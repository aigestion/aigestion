<#
.SYNOPSIS
    NexusGuardian - Master Orchestrator for AIGestion
    The Nexus Ritual V2: Automated Continuous Guardian.

.DESCRIPTION
    The evolved Nexus Ritual. Orchestrates all Guardian modules:
    - NexusDoctor   (System Health Diagnostics)
    - NexusCodeScan (Code Quality Analysis)
    - NexusSecurityScan (Vulnerability Scanning)
    - NexusReport   (Structured Reporting)
    - GodMode       (Resource Recovery)

    Modes:
    - Full  : All checks + GodMode + report (default)
    - Quick : Doctor + fast lint only (~30s)
    - Watch : Continuous file watcher + scheduled deep scans
    - Fix   : Auto-fix lint/format + Doctor healing

.PARAMETER Mode
    Execution mode: Full, Quick, Watch, Fix. Default: Full.

.PARAMETER DryRun
    Simulates all checks without executing commands.

.PARAMETER SkipSecurity
    Skip security scans (faster for development-focused runs).

.PARAMETER SkipGodMode
    Skip resource recovery (GodMode).

.PARAMETER SkipDevEnv
    Skip DevDesktopSetup launch.
#>

param(
    [ValidateSet("Full", "Quick", "Watch", "Fix")]
    [string]$Mode = "Full",

    [switch]$DryRun,
    [switch]$SkipSecurity,
    [switch]$SkipGodMode,
    [switch]$SkipDevEnv
)

$ErrorActionPreference = "Continue"
$RootPath = "C:\Users\Alejandro\AIGestion"
$OpsPath = "$RootPath\ops"
$startTime = Get-Date

# -- Banner --
function Write-GuardianBanner {
    Clear-Host
    Write-Host ""
    Write-Host ("*" * 60) -ForegroundColor Magenta
    Write-Host "   NEXUS GUARDIAN V2  [$Mode MODE]" -ForegroundColor Magenta
    Write-Host ("*" * 60) -ForegroundColor Magenta
    Write-Host ""
    if ($DryRun) {
        Write-Host "   DRY-RUN MODE - No changes will be made" -ForegroundColor Yellow
        Write-Host ""
    }
}

Write-GuardianBanner

# -- Watch Mode: Delegate to NexusWatcher --
if ($Mode -eq "Watch") {
    Write-Host ">> Delegating to NexusWatcher..." -ForegroundColor Cyan
    $watcherScript = Join-Path $OpsPath "NexusWatcher.ps1"
    if (Test-Path $watcherScript) {
        $watchParams = @{}
        if ($DryRun) { $watchParams["DryRun"] = $true }
        & $watcherScript @watchParams
    }
    else {
        Write-Host "   [ERROR] NexusWatcher.ps1 not found!" -ForegroundColor Red
    }
    exit
}

# -- Collect Results --
$allResults = @()

# -- STEP 1: Nexus Doctor --
Write-Host ("_" * 58) -ForegroundColor DarkGray
$totalSteps = if ($Mode -eq 'Quick') { '2' } elseif ($Mode -eq 'Fix') { '3' } else { '5' }
Write-Host "  STEP 1/$totalSteps : NEXUS DOCTOR" -ForegroundColor White
Write-Host ("_" * 58) -ForegroundColor DarkGray

$doctorScript = Join-Path $OpsPath "NexusDoctor.ps1"
if (Test-Path $doctorScript) {
    $doctorParams = @{}
    if ($DryRun) { $doctorParams["DryRun"] = $true }
    if ($Mode -eq "Fix") { $doctorParams["Fix"] = $true }
    $doctorResult = & $doctorScript @doctorParams
    $allResults += $doctorResult
}
else {
    Write-Host "   [ERROR] NexusDoctor.ps1 not found!" -ForegroundColor Red
}

# -- STEP 2: Code Scan --
Write-Host ""
Write-Host ("_" * 58) -ForegroundColor DarkGray
Write-Host "  STEP 2: CODE SCAN" -ForegroundColor White
Write-Host ("_" * 58) -ForegroundColor DarkGray

$codeScript = Join-Path $OpsPath "NexusCodeScan.ps1"
if (Test-Path $codeScript) {
    $codeParams = @{}
    if ($DryRun) { $codeParams["DryRun"] = $true }
    if ($Mode -eq "Quick") { $codeParams["Quick"] = $true }
    if ($Mode -eq "Fix") { $codeParams["Fix"] = $true }
    $codeResult = & $codeScript @codeParams
    $allResults += $codeResult
}
else {
    Write-Host "   [ERROR] NexusCodeScan.ps1 not found!" -ForegroundColor Red
}

# Quick mode ends here
if ($Mode -eq "Quick") {
    $reportScript = Join-Path $OpsPath "NexusReport.ps1"
    if (Test-Path $reportScript) {
        & $reportScript -Results $allResults
    }

    $elapsed = (Get-Date) - $startTime
    Write-Host "`n>> Quick scan completed in $([math]::Round($elapsed.TotalSeconds, 1))s" -ForegroundColor Green
    exit
}

# -- STEP 3: Security Scan --
if (-not $SkipSecurity -and $Mode -ne "Fix") {
    Write-Host ""
    Write-Host ("_" * 58) -ForegroundColor DarkGray
    Write-Host "  STEP 3: SECURITY SCAN" -ForegroundColor White
    Write-Host ("_" * 58) -ForegroundColor DarkGray

    $secScript = Join-Path $OpsPath "NexusSecurityScan.ps1"
    if (Test-Path $secScript) {
        $secParams = @{}
        if ($DryRun) { $secParams["DryRun"] = $true }
        $secResult = & $secScript @secParams
        $allResults += $secResult
    }
    else {
        Write-Host "   [ERROR] NexusSecurityScan.ps1 not found!" -ForegroundColor Red
    }
}
elseif ($SkipSecurity) {
    Write-Host "`n   [SKIP] Security scan skipped (-SkipSecurity)" -ForegroundColor DarkGray
}

# -- STEP 4: GodMode (Resource Recovery) --
if (-not $SkipGodMode -and $Mode -eq "Full") {
    Write-Host ""
    Write-Host ("_" * 58) -ForegroundColor DarkGray
    Write-Host "  STEP 4: GODMODE (RESOURCE RECOVERY)" -ForegroundColor White
    Write-Host ("_" * 58) -ForegroundColor DarkGray

    $godModeScript = Join-Path $OpsPath "GodMode.ps1"
    if (Test-Path $godModeScript) {
        $gmParams = @{}
        if ($DryRun) { $gmParams["DryRun"] = $true }
        & $godModeScript @gmParams
    }
    else {
        Write-Host "   [WARN] GodMode.ps1 not found." -ForegroundColor Yellow
    }
}

# -- STEP 5: Report --
Write-Host ""
Write-Host ("_" * 58) -ForegroundColor DarkGray
$stepNum = if ($Mode -eq "Fix") { "3" } else { "5" }
Write-Host "  STEP $stepNum`: GENERATING REPORT" -ForegroundColor White
Write-Host ("_" * 58) -ForegroundColor DarkGray

$reportScript = Join-Path $OpsPath "NexusReport.ps1"
if (Test-Path $reportScript) {
    $report = & $reportScript -Results $allResults
}
else {
    Write-Host "   [WARN] NexusReport.ps1 not found." -ForegroundColor Yellow
}

# -- Final Banner --
$elapsed = (Get-Date) - $startTime
Write-Host ""
Write-Host ("*" * 60) -ForegroundColor Magenta
Write-Host "   NEXUS GUARDIAN: RITUAL COMPLETE" -ForegroundColor Magenta
Write-Host "   Duration: $([math]::Round($elapsed.TotalSeconds, 1))s" -ForegroundColor DarkGray
Write-Host ("*" * 60) -ForegroundColor Magenta
Write-Host ""
Write-Host "Stay Sovereign, Alejandro.`n" -ForegroundColor Cyan

# Exit with appropriate code for CI/CD integration
if ($report -and $report.OverallStatus -in @("CRITICAL", "HIGH", "UNHEALTHY")) {
    exit 1
}
exit 0
