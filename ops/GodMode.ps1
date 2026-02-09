<#
.SYNOPSIS
    GodMode.ps1 - Ultimate Maintenance for AIGestion Mini PC
    Dedicated to: AIGestion / Docker / Antigravity

.DESCRIPTION
    1. Diagnostics Baseline (RAM/Disk)
    2. Process Purification (Kills non-core heavy processes)
    3. Deep Cache Sanity (NPM, PNPM, Turbo, Temp, VS Code)
    4. Memory Hardening (Working Set Trimming)
    5. Final Impact Report

.PARAMETER DryRun
    Simulate actions without deleting files or killing processes.
#>

param(
    [switch]$DryRun,
    [switch]$Aggressive,
    [int]$NodeMemoryThresholdMB = 1500
)

function Write-Banner {
    param($Title)
    Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan -Bold
    Write-Host ("=" * 60) + "`n" -ForegroundColor Cyan
}

function Write-Section {
    param($Msg)
    Write-Host ">> $Msg" -ForegroundColor Yellow
}

function Get-ResourceSnapshot {
    $os = Get-CimInstance Win32_OperatingSystem
    $disk = Get-PSDrive C | Select-Object Used, Free
    return @{
        FreeRAM_GB = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
        UsedDisk_GB = [math]::Round($disk.Used / 1GB, 2)
        FreeDisk_GB = [math]::Round($disk.Free / 1GB, 2)
    }
}

$ErrorActionPreference = "Stop"
$OptimizationLog = Join-Path $env:USERPROFILE "GodMode-Cleanup.log"

Write-Banner "GOD-MODE OPTIMIZATION: AIGESTION NEXUS"

# 1. Diagnostic Baseline
Write-Section "Capturing Diagnostic Baseline..."
$baseline = Get-ResourceSnapshot
Write-Host "Baseline RAM: $($baseline.FreeRAM_GB) GB Free"
Write-Host "Baseline Disk: $($baseline.UsedDisk_GB) GB Used / $($baseline.FreeDisk_GB) GB Free"

# 2. Process Purification
Write-Section "Purifying System Processes..."
$nonCoreTargets = @("chrome", "java", "msedge", "teams", "discord")
foreach ($proc in $nonCoreTargets) {
    if (Get-Process $proc -ErrorAction SilentlyContinue) {
        if ($DryRun) { Write-Host "[DRY-RUN] Would kill: $proc" -ForegroundColor Gray }
        else {
            Write-Host "Terminating: $proc" -ForegroundColor Red
            Stop-Process -Name $proc -Force -ErrorAction SilentlyContinue
        }
    }
}

# 3. Cache Sanization
Write-Section "Sanitizing Development Caches..."
$cacheDirs = @(
    "$env:USERPROFILE\.npm\_cacache",
    "$env:USERPROFILE\.pnpm-cache",
    "$env:USERPROFILE\.turbo",
    "$env:LOCALAPPDATA\Temp\jest",
    "$env:LOCALAPPDATA\Microsoft\Windows\Explorer\*thumb*",
    "C:\Windows\Temp\*",
    "$env:TEMP\*"
)

foreach ($dir in $cacheDirs) {
    if (Test-Path $dir) {
        if ($DryRun) { Write-Host "[DRY-RUN] Would clear: $dir" -ForegroundColor Gray }
        else {
            Write-Host "Clearing: $dir" -ForegroundColor DarkGray
            Remove-Item $dir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# 4. Memory Hardening
Write-Section "Hardening Memory Allocation..."
if (-not $DryRun) {
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    # Request Working Set Trimming for all processes
    Get-Process | ForEach-Object {
        try {
            $_.EmptyWorkingSet() | Out-Null
        } catch {}
    }
    Write-Host "Memory Trimmed." -ForegroundColor Green
} else {
    Write-Host "[DRY-RUN] Would perform RAM GC and trim." -ForegroundColor Gray
}

# 5. Final Report
Write-Section "Generating Impact Report..."
$after = Get-ResourceSnapshot
$ramGained = [math]::Round($after.FreeRAM_GB - $baseline.FreeRAM_GB, 2)
$diskFreed = [math]::Round($baseline.UsedDisk_GB - $after.UsedDisk_GB, 2)

Write-Host "RAM Recovered: $ramGained GB" -ForegroundColor Green
Write-Host "Disk Reclaimed: $diskFreed GB" -ForegroundColor Green
Write-Host "Current Free RAM: $($after.FreeRAM_GB) GB" -ForegroundColor Cyan
Write-Banner "SYSTEM STATUS: GOD LEVEL OPTIMAL"
