<#
.SYNOPSIS
    NexusReport - Structured Report Generator for Nexus Guardian
    Part of the Nexus Guardian V2 System.

.DESCRIPTION
    Converts module scan results into structured reports:
    1. JSON output for CI/automation
    2. Console dashboard (colored summary table)
    3. History tracking (saved to logs/nexus-guardian/)
    4. Trend detection (compares with previous run)

.PARAMETER Results
    Array of result hashtables from the scanning modules.

.PARAMETER OutputDir
    Directory to write reports to. Defaults to logs/nexus-guardian/.

.PARAMETER Silent
    Suppress console output (only write file).
#>

param(
    [Parameter(Mandatory = $true)]
    [array]$Results,

    [string]$OutputDir = "C:\Users\Alejandro\AIGestion\logs\nexus-guardian",

    [switch]$Silent
)

$ErrorActionPreference = "Continue"

# -- Ensure output directory --
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# -- Build Report Object --
$timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
$report = @{
    Timestamp       = (Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz")
    SystemName      = "AIGestion Nexus"
    GuardianVersion = "2.0.0"
    OverallStatus   = "PASS"
    Modules         = @()
    Summary         = @{
        TotalErrors   = 0
        TotalWarnings = 0
        TotalVulns    = 0
        CriticalVulns = 0
    }
}

foreach ($result in $Results) {
    if ($null -eq $result) { continue }

    $report.Modules += $result

    # Aggregate counts
    if ($result.Errors) { $report.Summary.TotalErrors += $result.Errors }
    if ($result.Warnings) { $report.Summary.TotalWarnings += $result.Warnings }
    if ($result.TotalVulns) { $report.Summary.TotalVulns += $result.TotalVulns }
    if ($result.Critical) { $report.Summary.CriticalVulns += $result.Critical }

    # Determine overall status (worst wins)
    $statusPriority = @{ "PASS" = 0; "HEALTHY" = 0; "SKIP" = 0; "WARN" = 1; "FAIL" = 2; "HIGH" = 3; "UNHEALTHY" = 3; "CRITICAL" = 4 }
    $cpKey = $report.OverallStatus
    $mpKey = $result.Status
    $currentPriority = if ($statusPriority.ContainsKey($cpKey)) { $statusPriority[$cpKey] } else { 0 }
    $modulePriority = if ($statusPriority.ContainsKey($mpKey)) { $statusPriority[$mpKey] } else { 0 }
    if ($modulePriority -gt $currentPriority) {
        $report.OverallStatus = $result.Status
    }
}

# -- Save JSON Report --
$reportFile = Join-Path $OutputDir "report-$timestamp.json"
$report | ConvertTo-Json -Depth 10 | Set-Content -Path $reportFile -Encoding UTF8
$latestFile = Join-Path $OutputDir "report-latest.json"
$report | ConvertTo-Json -Depth 10 | Set-Content -Path $latestFile -Encoding UTF8

# -- Trend Detection --
$trend = @{
    ErrorsDelta   = 0
    WarningsDelta = 0
    VulnsDelta    = 0
    Direction     = "STABLE"
}

$previousReports = Get-ChildItem $OutputDir -Filter "report-*.json" |
    Where-Object { $_.Name -ne "report-latest.json" -and $_.Name -ne "report-$timestamp.json" } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if ($previousReports) {
    try {
        $prev = Get-Content $previousReports.FullName | ConvertFrom-Json
        $prevErrors = if ($prev.Summary.TotalErrors) { $prev.Summary.TotalErrors } else { 0 }
        $prevWarnings = if ($prev.Summary.TotalWarnings) { $prev.Summary.TotalWarnings } else { 0 }
        $prevVulns = if ($prev.Summary.TotalVulns) { $prev.Summary.TotalVulns } else { 0 }
        $trend.ErrorsDelta = $report.Summary.TotalErrors - $prevErrors
        $trend.WarningsDelta = $report.Summary.TotalWarnings - $prevWarnings
        $trend.VulnsDelta = $report.Summary.TotalVulns - $prevVulns

        if ($trend.ErrorsDelta -lt 0 -or $trend.VulnsDelta -lt 0) { $trend.Direction = "IMPROVING" }
        elseif ($trend.ErrorsDelta -gt 0 -or $trend.VulnsDelta -gt 0) { $trend.Direction = "REGRESSING" }
    }
    catch {
        # Ignore parsing errors from old reports
    }
}

# -- Cleanup old reports (keep 7 days) --
$cutoff = (Get-Date).AddDays(-7)
Get-ChildItem $OutputDir -Filter "report-*.json" |
    Where-Object { $_.Name -ne "report-latest.json" -and $_.LastWriteTime -lt $cutoff } |
    Remove-Item -Force -ErrorAction SilentlyContinue

# -- Console Dashboard --
if (-not $Silent) {
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor Magenta
    Write-Host "  NEXUS GUARDIAN REPORT" -ForegroundColor Magenta
    Write-Host ("=" * 60) -ForegroundColor Magenta
    Write-Host ""

    # Module status table
    Write-Host "  Module          | Status     | Details" -ForegroundColor White
    Write-Host ("  " + ("-" * 55)) -ForegroundColor DarkGray

    foreach ($mod in $report.Modules) {
        if ($null -eq $mod) { continue }
        $modName = ($(if ($mod.Module) { $mod.Module } else { "Unknown" })).PadRight(16)
        $modStatus = ($(if ($mod.Status) { $mod.Status } else { "?" })).PadRight(10)

        $statusColor = switch ($mod.Status) {
            "PASS"     { "Green" }
            "HEALTHY"  { "Green" }
            "FAIL"     { "Red" }
            "UNHEALTHY"{ "Red" }
            "CRITICAL" { "Magenta" }
            "HIGH"     { "Red" }
            "WARN"     { "Yellow" }
            default    { "DarkGray" }
        }

        $details = ""
        if ($mod.Errors -and $mod.Errors -gt 0) { $details += "E:$($mod.Errors) " }
        if ($mod.Warnings -and $mod.Warnings -gt 0) { $details += "W:$($mod.Warnings) " }
        if ($mod.TotalVulns -and $mod.TotalVulns -gt 0) { $details += "V:$($mod.TotalVulns)" }
        if (-not $details) { $details = "OK" }

        Write-Host "  $modName| " -NoNewline -ForegroundColor White
        Write-Host "$modStatus" -NoNewline -ForegroundColor $statusColor
        Write-Host "| $details" -ForegroundColor DarkGray
    }

    Write-Host ""

    # Trend indicator
    $trendIcon = switch ($trend.Direction) {
        "IMPROVING"  { "[UP]" }
        "REGRESSING" { "[DOWN]" }
        default      { "[==]" }
    }
    $trendColor = switch ($trend.Direction) {
        "IMPROVING"  { "Green" }
        "REGRESSING" { "Red" }
        default      { "DarkGray" }
    }
    Write-Host "  $trendIcon Trend: $($trend.Direction)" -ForegroundColor $trendColor
    if ($trend.Direction -ne "STABLE") {
        $errDelta = if ($trend.ErrorsDelta -gt 0) { "+$($trend.ErrorsDelta)" } else { "$($trend.ErrorsDelta)" }
        $vulnDelta = if ($trend.VulnsDelta -gt 0) { "+$($trend.VulnsDelta)" } else { "$($trend.VulnsDelta)" }
        Write-Host "     Errors: $errDelta | Vulns: $vulnDelta" -ForegroundColor DarkGray
    }

    # Overall status
    Write-Host ""
    $overallColor = switch ($report.OverallStatus) {
        "PASS"     { "Green" }
        "CRITICAL" { "Magenta" }
        default    { "Red" }
    }
    $overallTag = switch ($report.OverallStatus) {
        "PASS"     { "[OK]" }
        "CRITICAL" { "[!!]" }
        default    { "[??]" }
    }
    Write-Host "  $overallTag OVERALL: $($report.OverallStatus) | Errors: $($report.Summary.TotalErrors) | Warnings: $($report.Summary.TotalWarnings) | Vulns: $($report.Summary.TotalVulns)" -ForegroundColor $overallColor
    Write-Host "  Report: $reportFile" -ForegroundColor DarkGray
    Write-Host ("=" * 60) -ForegroundColor Magenta
}

return $report
