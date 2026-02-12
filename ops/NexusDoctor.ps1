<#
.SYNOPSIS
    NexusDoctor V2 - Enhanced System Diagnostics & Healing
    Part of the Nexus Guardian V2 System.

.DESCRIPTION
    Comprehensive system health check:
    1. Critical scripts & tools
    2. Docker container health & orphan detection
    3. Service endpoint health (curl)
    4. Environment validation (.env)
    5. Git status & branch hygiene
    6. System resources (disk, memory)

.PARAMETER Fix
    Attempts to fix found issues (orphan containers, stale locks, etc).

.PARAMETER DryRun
    Simulates all checks and fixes.
#>

param(
    [switch]$Fix,
    [switch]$DryRun
)

$ErrorActionPreference = "Continue"
$RootPath = "C:\Users\Alejandro\AIGestion"
$OpsPath = "$RootPath\ops"

# -- Result Accumulator --
$script:Results = @{
    Module    = "Doctor"
    Timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
    Status    = "HEALTHY"
    Checks    = @()
    Errors    = 0
    Warnings  = 0
}

function Add-DiagResult {
    param($Name, $Status, $Details = "")
    $script:Results.Checks += @{ Name = $Name; Status = $Status; Details = $Details }
    if ($Status -eq "FAIL") { $script:Results.Status = "UNHEALTHY"; $script:Results.Errors++ }
    elseif ($Status -eq "WARN") { $script:Results.Warnings++ }
}

function Write-Diag {
    param($Name, $Status, $Detail = "")
    $icon = switch ($Status) {
        "PASS" { "[OK]" }
        "FAIL" { "[FAIL]" }
        "WARN" { "[WARN]" }
        "SKIP" { "[SKIP]" }
        "HEAL" { "[HEAL]" }
        default { "[--]" }
    }
    $color = switch ($Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "WARN" { "Yellow" }
        "SKIP" { "DarkGray" }
        "HEAL" { "Cyan" }
        default { "White" }
    }
    Write-Host "   $icon $Name" -ForegroundColor $color -NoNewline
    if ($Detail) { Write-Host " -- $Detail" -ForegroundColor DarkGray } else { Write-Host "" }
}

# -- Banner --
Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "  NEXUS DOCTOR V2" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

# -- 1. Critical Scripts --
Write-Host ">> 1. CRITICAL SCRIPTS & TOOLS" -ForegroundColor Yellow

$criticalFiles = @{
    "NexusGuardian"   = "$OpsPath\NexusGuardian.ps1"
    "NexusDoctor"     = "$OpsPath\NexusDoctor.ps1"
    "GodMode"         = "$OpsPath\GodMode.ps1"
    "NexusCodeScan"   = "$OpsPath\NexusCodeScan.ps1"
    "NexusSecScan"    = "$OpsPath\NexusSecurityScan.ps1"
    "DevDesktopSetup" = "$OpsPath\DevDesktopSetup.ps1"
}

foreach ($key in $criticalFiles.Keys) {
    if (Test-Path $criticalFiles[$key]) {
        Write-Diag $key "PASS"
        Add-DiagResult -Name "Script-$key" -Status "PASS"
    }
    else {
        Write-Diag $key "FAIL" "Not found at $($criticalFiles[$key])"
        Add-DiagResult -Name "Script-$key" -Status "FAIL" -Details "Missing"
    }
}

# Tool availability
foreach ($tool in @("node", "pnpm", "git", "docker")) {
    $cmd = Get-Command $tool -ErrorAction SilentlyContinue
    if ($cmd) {
        $ver = & $tool --version 2>&1 | Select-Object -First 1
        Write-Diag "$tool" "PASS" "$ver"
        Add-DiagResult -Name "Tool-$tool" -Status "PASS" -Details $ver
    }
    else {
        Write-Diag "$tool" "FAIL" "Not in PATH"
        Add-DiagResult -Name "Tool-$tool" -Status "FAIL" -Details "Not installed"
    }
}

# -- 2. Docker Health --
Write-Host "`n>> 2. DOCKER CONTAINER HEALTH" -ForegroundColor Yellow

if ($DryRun) {
    Write-Diag "Docker Health" "SKIP" "[DRY-RUN]"
    Add-DiagResult -Name "Docker" -Status "SKIP"
}
else {
    try {
        $dockerRunning = docker info 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0) {
            Write-Diag "Docker Engine" "PASS" "Running"

            $containers = docker compose -f "$RootPath\docker-compose.yml" ps --format json 2>&1
            if ($LASTEXITCODE -eq 0 -and $containers) {
                Write-Diag "Docker Compose" "PASS" "Services detected"
                Add-DiagResult -Name "Docker-Compose" -Status "PASS"
            }
            else {
                Write-Diag "Docker Compose" "WARN" "No running services"
                Add-DiagResult -Name "Docker-Compose" -Status "WARN" -Details "No services"
            }

            $orphans = docker ps --filter "status=restarting" --format "{{.Names}}" 2>&1 | Out-String
            if ($orphans.Trim()) {
                Write-Diag "Orphan Containers" "WARN" "Restarting: $($orphans.Trim())"
                Add-DiagResult -Name "Docker-Orphans" -Status "WARN" -Details $orphans.Trim()
                if ($Fix) {
                    Write-Diag "Auto-Heal" "HEAL" "Removing orphans..."
                    docker compose -f "$RootPath\docker-compose.yml" up -d --remove-orphans 2>&1 | Out-Null
                }
            }
            else {
                Write-Diag "Orphan Containers" "PASS" "None"
                Add-DiagResult -Name "Docker-Orphans" -Status "PASS"
            }
        }
        else {
            Write-Diag "Docker Engine" "WARN" "Not running (start Docker Desktop)"
            Add-DiagResult -Name "Docker" -Status "WARN" -Details "Not running"
        }
    }
    catch {
        Write-Diag "Docker" "WARN" "Docker check failed"
        Add-DiagResult -Name "Docker" -Status "WARN" -Details $_.Exception.Message
    }
}

# -- 3. Service Endpoints --
Write-Host "`n>> 3. SERVICE ENDPOINTS" -ForegroundColor Yellow

$endpoints = @(
    @{ Name = "Backend API"; Url = "http://localhost:3000/api/health" },
    @{ Name = "ML Service"; Url = "http://localhost:4000/health" }
)

if ($DryRun) {
    foreach ($ep in $endpoints) {
        Write-Diag $ep.Name "SKIP" "[DRY-RUN] Would check $($ep.Url)"
    }
}
else {
    foreach ($ep in $endpoints) {
        try {
            $response = Invoke-WebRequest -Uri $ep.Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Diag $ep.Name "PASS" "HTTP 200"
                Add-DiagResult -Name "Endpoint-$($ep.Name)" -Status "PASS"
            }
            else {
                Write-Diag $ep.Name "WARN" "HTTP $($response.StatusCode)"
                Add-DiagResult -Name "Endpoint-$($ep.Name)" -Status "WARN" -Details "HTTP $($response.StatusCode)"
            }
        }
        catch {
            Write-Diag $ep.Name "WARN" "Unreachable (service not running?)"
            Add-DiagResult -Name "Endpoint-$($ep.Name)" -Status "WARN" -Details "Connection failed"
        }
    }
}

# -- 4. Environment Validation --
Write-Host "`n>> 4. ENVIRONMENT VALIDATION" -ForegroundColor Yellow

$envFile = "$RootPath\.env"
if (Test-Path $envFile) {
    Write-Diag ".env file" "PASS" "Exists"
    Add-DiagResult -Name "Env-File" -Status "PASS"

    $envContent = Get-Content $envFile -Raw
    $placeholders = ([regex]::Matches($envContent, "your[-_]|PLACEHOLDER|changeme|TODO", "IgnoreCase")).Count
    if ($placeholders -gt 0) {
        Write-Diag ".env placeholders" "WARN" "$placeholders unconfigured values"
        Add-DiagResult -Name "Env-Placeholders" -Status "WARN" -Details "$placeholders placeholders"
    }
    else {
        Write-Diag ".env placeholders" "PASS" "All values configured"
        Add-DiagResult -Name "Env-Placeholders" -Status "PASS"
    }
}
else {
    Write-Diag ".env file" "FAIL" "NOT FOUND!"
    Add-DiagResult -Name "Env-File" -Status "FAIL" -Details "Missing"
}

$envExample = "$RootPath\.env.example"
if ((Test-Path $envFile) -and (Test-Path $envExample)) {
    $envKeys = (Get-Content $envFile | Where-Object { $_ -match "^\w+=" }) | ForEach-Object { ($_ -split "=")[0] }
    $exampleKeys = (Get-Content $envExample | Where-Object { $_ -match "^\w+=" }) | ForEach-Object { ($_ -split "=")[0] }
    $missingFromExample = $envKeys | Where-Object { $_ -notin $exampleKeys }
    if ($missingFromExample.Count -gt 0) {
        Write-Diag ".env/.env.example sync" "WARN" "$($missingFromExample.Count) keys missing from .env.example"
        Add-DiagResult -Name "Env-Sync" -Status "WARN" -Details "$($missingFromExample.Count) keys out of sync"
    }
    else {
        Write-Diag ".env/.env.example sync" "PASS" "In sync"
        Add-DiagResult -Name "Env-Sync" -Status "PASS"
    }
}

# -- 5. Git Status --
Write-Host "`n>> 5. GIT STATUS" -ForegroundColor Yellow

if ($DryRun) {
    Write-Diag "Git Status" "SKIP" "[DRY-RUN]"
}
else {
    try {
        $gitStatus = & git -C $RootPath status --porcelain 2>&1 | Out-String
        $changedFiles = ($gitStatus.Trim() -split "`n" | Where-Object { $_.Trim() }).Count
        if ($changedFiles -eq 0) {
            Write-Diag "Working Tree" "PASS" "Clean"
            Add-DiagResult -Name "Git-WorkTree" -Status "PASS"
        }
        else {
            Write-Diag "Working Tree" "WARN" "$changedFiles uncommitted changes"
            Add-DiagResult -Name "Git-WorkTree" -Status "WARN" -Details "$changedFiles files"
        }

        $lockFile = "$RootPath\.git\index.lock"
        if (Test-Path $lockFile) {
            Write-Diag "Git Lock File" "WARN" "index.lock exists (stale?)"
            Add-DiagResult -Name "Git-Lock" -Status "WARN" -Details "Stale lock"
            if ($Fix) {
                Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
                Write-Diag "Auto-Heal" "HEAL" "Removed index.lock"
            }
        }
        else {
            Write-Diag "Git Lock File" "PASS" "No stale locks"
            Add-DiagResult -Name "Git-Lock" -Status "PASS"
        }
    }
    catch {
        Write-Diag "Git" "WARN" "Git check failed"
        Add-DiagResult -Name "Git" -Status "WARN"
    }
}

# -- 6. System Resources --
Write-Host "`n>> 6. SYSTEM RESOURCES" -ForegroundColor Yellow

$disk = Get-PSDrive C
$freeGB = [math]::Round($disk.Free / 1GB, 2)
if ($freeGB -gt 20) {
    Write-Diag "Disk Space" "PASS" "$freeGB GB free"
    Add-DiagResult -Name "Disk" -Status "PASS" -Details "$freeGB GB"
}
elseif ($freeGB -gt 10) {
    Write-Diag "Disk Space" "WARN" "$freeGB GB free (getting low)"
    Add-DiagResult -Name "Disk" -Status "WARN" -Details "$freeGB GB"
}
else {
    Write-Diag "Disk Space" "FAIL" "$freeGB GB free (CRITICAL!)"
    Add-DiagResult -Name "Disk" -Status "FAIL" -Details "$freeGB GB"
}

$os = Get-CimInstance Win32_OperatingSystem
$freeRAM = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
if ($freeRAM -gt 2) {
    Write-Diag "Free RAM" "PASS" "$freeRAM GB"
    Add-DiagResult -Name "RAM" -Status "PASS" -Details "$freeRAM GB"
}
else {
    Write-Diag "Free RAM" "WARN" "$freeRAM GB (low!)"
    Add-DiagResult -Name "RAM" -Status "WARN" -Details "$freeRAM GB"
}

# -- Summary --
Write-Host ""
Write-Host ("-" * 60) -ForegroundColor Cyan
$summaryColor = if ($script:Results.Status -eq "HEALTHY") { "Green" } else { "Red" }
$tag = if ($script:Results.Status -eq "HEALTHY") { "[OK]" } else { "[!!]" }
Write-Host "  $tag HEALTH: $($script:Results.Status) | Errors: $($script:Results.Errors) | Warnings: $($script:Results.Warnings)" -ForegroundColor $summaryColor
Write-Host ("-" * 60) -ForegroundColor Cyan

return $script:Results
