<#
.SYNOPSIS
    NexusWatcher - Continuous File Watcher & Scheduled Scanner
    Part of the Nexus Guardian V2 System.

.DESCRIPTION
    The "always-on" guardian that runs in the background:
    1. File system watcher on source directories
    2. Debounced quick scans on file changes
    3. Scheduled deep scans (configurable interval)
    4. Windows toast notifications for critical findings
    5. Log rotation (7 days)

.PARAMETER DeepScanIntervalMinutes
    Interval between full deep scans. Default: 120 (2 hours).

.PARAMETER DebounceSec
    Seconds to wait after last file change before triggering scan. Default: 5.

.PARAMETER WatchPaths
    Array of relative paths (from project root) to watch.

.PARAMETER DryRun
    Simulates watchers without executing scans.
#>

param(
    [int]$DeepScanIntervalMinutes = 120,
    [int]$DebounceSec = 5,
    [string[]]$WatchPaths = @("backend\src", "frontend\apps", "ml-service\app"),
    [switch]$DryRun
)

$ErrorActionPreference = "Continue"
$RootPath = "C:\Users\Alejandro\AIGestion"
$OpsPath = "$RootPath\ops"
$LogDir = "$RootPath\logs\nexus-guardian"

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

# -- Toast Notification Helper --
function Send-NexusToast {
    param(
        [string]$Title = "Nexus Guardian",
        [string]$Message,
        [ValidateSet("Info", "Warning", "Error")]
        [string]$Severity = "Info"
    )

    try {
        $burntToast = Get-Module -ListAvailable BurntToast -ErrorAction SilentlyContinue
        if ($burntToast) {
            Import-Module BurntToast -ErrorAction SilentlyContinue
            New-BurntToastNotification -Text "$Title", $Message -ErrorAction SilentlyContinue
        }
        else {
            # Fallback: console output
            $color = switch ($Severity) {
                "Error" { "Red" }
                "Warning" { "Yellow" }
                default { "Cyan" }
            }
            Write-Host "   [TOAST] $Title : $Message" -ForegroundColor $color
        }
    }
    catch {
        Write-Host "   [TOAST] $Title : $Message" -ForegroundColor DarkYellow
    }
}

# -- Quick Scan (on file change) --
function Invoke-QuickScan {
    param([string]$TriggerFile = "")

    $scanTime = Get-Date -Format "HH:mm:ss"
    Write-Host "`n[$scanTime] Quick Scan triggered" -ForegroundColor Cyan -NoNewline
    if ($TriggerFile) { Write-Host " by: $TriggerFile" -ForegroundColor DarkGray } else { Write-Host "" }

    if ($DryRun) {
        Write-Host "   [DRY-RUN] Would run: NexusCodeScan.ps1 -Quick" -ForegroundColor DarkGray
        return
    }

    try {
        $codeResult = & "$OpsPath\NexusCodeScan.ps1" -Quick 2>&1

        if ($codeResult -and $codeResult.Status -eq "FAIL") {
            Send-NexusToast -Title "Code Issues Found" -Message "ESLint detected $($codeResult.Errors) errors." -Severity "Warning"
        }

        $logEntry = @{
            Timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
            Type      = "QuickScan"
            Trigger   = $TriggerFile
            Status    = if ($codeResult) { $codeResult.Status } else { "UNKNOWN" }
        }
        $logEntry | ConvertTo-Json | Add-Content -Path "$LogDir\watcher-$(Get-Date -Format 'yyyy-MM-dd').log"
    }
    catch {
        Write-Host "   [ERROR] Quick scan failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# -- Deep Scan (scheduled) --
function Invoke-DeepScan {
    $scanTime = Get-Date -Format "HH:mm:ss"
    Write-Host "`n[$scanTime] Deep Scan starting..." -ForegroundColor Magenta

    if ($DryRun) {
        Write-Host "   [DRY-RUN] Would run full scan" -ForegroundColor DarkGray
        return
    }

    try {
        $codeResult = & "$OpsPath\NexusCodeScan.ps1" 2>&1
        $secResult = & "$OpsPath\NexusSecurityScan.ps1" -SkipTrivy 2>&1
        $doctorResult = & "$OpsPath\NexusDoctor.ps1" 2>&1

        $allResults = @($doctorResult, $codeResult, $secResult)
        & "$OpsPath\NexusReport.ps1" -Results $allResults -Silent 2>&1 | Out-Null

        if ($secResult -and $secResult.Status -in @("CRITICAL", "HIGH")) {
            Send-NexusToast -Title "Security Alert" -Message "Found critical vulnerabilities!" -Severity "Error"
        }
        elseif ($codeResult -and $codeResult.Status -eq "FAIL") {
            Send-NexusToast -Title "Code Quality Alert" -Message "$($codeResult.Errors) code errors detected." -Severity "Warning"
        }
        else {
            Send-NexusToast -Title "Deep Scan Complete" -Message "System healthy." -Severity "Info"
        }

        $logEntry = @{
            Timestamp      = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
            Type           = "DeepScan"
            CodeStatus     = if ($codeResult) { $codeResult.Status } else { "UNKNOWN" }
            SecurityStatus = if ($secResult) { $secResult.Status } else { "UNKNOWN" }
            DoctorStatus   = if ($doctorResult) { $doctorResult.Status } else { "UNKNOWN" }
        }
        $logEntry | ConvertTo-Json | Add-Content -Path "$LogDir\watcher-$(Get-Date -Format 'yyyy-MM-dd').log"
    }
    catch {
        Write-Host "   [ERROR] Deep scan failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# -- Log Rotation --
function Invoke-LogRotation {
    $cutoff = (Get-Date).AddDays(-7)
    Get-ChildItem $LogDir -Filter "watcher-*.log" |
    Where-Object { $_.LastWriteTime -lt $cutoff } |
    Remove-Item -Force -ErrorAction SilentlyContinue
}

# -- Main Watcher Loop --
Write-Host ""
Write-Host ("*" * 60) -ForegroundColor Green
Write-Host "  NEXUS WATCHER: CONTINUOUS GUARDIAN MODE" -ForegroundColor Green
Write-Host ("*" * 60) -ForegroundColor Green
Write-Host ""
Write-Host "  Monitoring:" -ForegroundColor White
foreach ($wp in $WatchPaths) {
    $fullPath = Join-Path $RootPath $wp
    if (Test-Path $fullPath) {
        Write-Host "    [OK] $wp" -ForegroundColor Green
    }
    else {
        Write-Host "    [--] $wp (not found, skipping)" -ForegroundColor Yellow
    }
}
Write-Host ""
Write-Host "  Quick scan:  On file change (${DebounceSec}s debounce)" -ForegroundColor DarkGray
Write-Host "  Deep scan:   Every ${DeepScanIntervalMinutes} minutes" -ForegroundColor DarkGray
Write-Host "  Log dir:     $LogDir" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Press Ctrl+C to stop the watcher." -ForegroundColor Yellow
Write-Host ""

# Create file system watchers
$watchers = @()

foreach ($wp in $WatchPaths) {
    $fullPath = Join-Path $RootPath $wp
    if (-not (Test-Path $fullPath)) { continue }

    $watcher = [System.IO.FileSystemWatcher]::new()
    $watcher.Path = $fullPath
    $watcher.Filter = "*.*"
    $watcher.IncludeSubdirectories = $true
    $watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName
    $watcher.EnableRaisingEvents = $false
    $watchers += $watcher
}

# Cleanup old logs on startup
Invoke-LogRotation

# Initial deep scan
Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Running initial scan..." -ForegroundColor Cyan
Invoke-DeepScan

$lastDeepScan = Get-Date

# Enable watcher events
foreach ($w in $watchers) {
    $w.EnableRaisingEvents = $true
}

try {
    while ($true) {
        foreach ($w in $watchers) {
            $result = $w.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
            if (-not $result.TimedOut) {
                $lastChangedFile = $result.Name

                # Debounce
                $deadline = (Get-Date).AddSeconds($DebounceSec)
                while ((Get-Date) -lt $deadline) {
                    $innerResult = $w.WaitForChanged([System.IO.WatcherChangeTypes]::All, 500)
                    if (-not $innerResult.TimedOut) {
                        $lastChangedFile = $innerResult.Name
                        $deadline = (Get-Date).AddSeconds($DebounceSec)
                    }
                }

                Invoke-QuickScan -TriggerFile $lastChangedFile
            }
        }

        # Scheduled deep scan
        $elapsed = (Get-Date) - $lastDeepScan
        if ($elapsed.TotalMinutes -ge $DeepScanIntervalMinutes) {
            Invoke-DeepScan
            $lastDeepScan = Get-Date
            Invoke-LogRotation
        }

        Start-Sleep -Milliseconds 200
    }
}
finally {
    foreach ($w in $watchers) {
        $w.EnableRaisingEvents = $false
        $w.Dispose()
    }
    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Nexus Watcher stopped." -ForegroundColor Yellow
}
