<#
.SYNOPSIS
    NexusSecurityScan - Vulnerability Scanner for AIGestion
    Part of the Nexus Guardian V2 System.

.DESCRIPTION
    Continuous security posture monitoring:
    1. Node.js dependency audit (pnpm audit)
    2. Python dependency audit (safety check)
    3. Secret/env leak detection (audit_env.js)
    4. Trivy filesystem scan (if installed)

.PARAMETER DryRun
    Simulates all checks without executing commands.

.PARAMETER SkipTrivy
    Skips Trivy scan (useful when not installed).
#>

param(
    [switch]$DryRun,
    [switch]$SkipTrivy
)

$ErrorActionPreference = "Continue"
$RootPath = "C:\Users\Alejandro\AIGestion"

# -- Result Accumulator --
$script:Results = @{
    Module        = "SecurityScan"
    Timestamp     = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
    Status        = "PASS"
    Checks        = @()
    Critical      = 0
    High          = 0
    Medium        = 0
    Low           = 0
    TotalVulns    = 0
}

function Add-VulnResult {
    param($Name, $Status, $Details = "", $Critical = 0, $High = 0, $Medium = 0, $Low = 0)
    $script:Results.Checks += @{
        Name     = $Name
        Status   = $Status
        Details  = $Details
        Critical = $Critical
        High     = $High
        Medium   = $Medium
        Low      = $Low
    }
    $script:Results.Critical += $Critical
    $script:Results.High += $High
    $script:Results.Medium += $Medium
    $script:Results.Low += $Low
    $script:Results.TotalVulns += ($Critical + $High + $Medium + $Low)

    if ($Critical -gt 0) { $script:Results.Status = "CRITICAL" }
    elseif ($High -gt 0 -and $script:Results.Status -ne "CRITICAL") { $script:Results.Status = "HIGH" }
    elseif ($Status -eq "FAIL" -and $script:Results.Status -notin @("CRITICAL", "HIGH")) { $script:Results.Status = "FAIL" }
}

function Write-Check {
    param($Name, $Status, $Detail = "")
    $icon = switch ($Status) {
        "PASS"     { "[OK]" }
        "FAIL"     { "[FAIL]" }
        "WARN"     { "[WARN]" }
        "CRITICAL" { "[!!]" }
        "SKIP"     { "[SKIP]" }
        default    { "[--]" }
    }
    $color = switch ($Status) {
        "PASS"     { "Green" }
        "FAIL"     { "Red" }
        "WARN"     { "Yellow" }
        "CRITICAL" { "Magenta" }
        "SKIP"     { "DarkGray" }
        default    { "White" }
    }
    Write-Host "   $icon $Name" -ForegroundColor $color -NoNewline
    if ($Detail) { Write-Host " -- $Detail" -ForegroundColor DarkGray } else { Write-Host "" }
}

function Parse-AuditSeverity {
    param($AuditOutput)
    $c = ([regex]::Matches($AuditOutput, "critical")).Count
    $h = ([regex]::Matches($AuditOutput, "\bhigh\b")).Count
    $m = ([regex]::Matches($AuditOutput, "moderate")).Count
    $l = ([regex]::Matches($AuditOutput, "\blow\b")).Count
    return @{ Critical = $c; High = $h; Medium = $m; Low = $l }
}

# -- Banner --
Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Red
Write-Host "  NEXUS SECURITY SCAN" -ForegroundColor Red
Write-Host ("=" * 60) -ForegroundColor Red
Write-Host ""

# -- 1. Node.js Dependency Audit --
Write-Host ">> 1. NODE.JS DEPENDENCY AUDIT" -ForegroundColor Yellow

$auditTargets = @(
    @{ Name = "Root"; Path = $RootPath },
    @{ Name = "Backend"; Path = "$RootPath\backend" },
    @{ Name = "Frontend"; Path = "$RootPath\frontend" }
)

foreach ($target in $auditTargets) {
    if ($DryRun) {
        Write-Check "pnpm audit ($($target.Name))" "SKIP" "[DRY-RUN] Would audit $($target.Path)"
        Add-VulnResult -Name "Audit-$($target.Name)" -Status "SKIP" -Details "Dry run"
    }
    else {
        try {
            $auditOut = & pnpm audit --audit-level moderate --dir $target.Path 2>&1 | Out-String
            $sev = Parse-AuditSeverity $auditOut

            if ($LASTEXITCODE -eq 0) {
                Write-Check "pnpm audit ($($target.Name))" "PASS" "No vulnerabilities"
                Add-VulnResult -Name "Audit-$($target.Name)" -Status "PASS"
            }
            else {
                $total = $sev.Critical + $sev.High + $sev.Medium + $sev.Low
                $status = if ($sev.Critical -gt 0) { "CRITICAL" } elseif ($sev.High -gt 0) { "FAIL" } else { "WARN" }
                Write-Check "pnpm audit ($($target.Name))" $status "C:$($sev.Critical) H:$($sev.High) M:$($sev.Medium) L:$($sev.Low)"
                Add-VulnResult -Name "Audit-$($target.Name)" -Status $status -Details $auditOut.Substring(0, [Math]::Min($auditOut.Length, 500)) `
                    -Critical $sev.Critical -High $sev.High -Medium $sev.Medium -Low $sev.Low
            }
        }
        catch {
            Write-Check "pnpm audit ($($target.Name))" "WARN" "Audit failed: $($_.Exception.Message)"
            Add-VulnResult -Name "Audit-$($target.Name)" -Status "WARN" -Details $_.Exception.Message
        }
    }
}

# -- 2. Python Dependency Audit --
Write-Host "`n>> 2. PYTHON DEPENDENCY AUDIT" -ForegroundColor Yellow

$mlReqFile = "$RootPath\ml-service\requirements.txt"

if ($DryRun) {
    Write-Check "Python safety check" "SKIP" "[DRY-RUN] Would run: safety check"
    Add-VulnResult -Name "Python-Safety" -Status "SKIP" -Details "Dry run"
}
elseif (-not (Test-Path $mlReqFile)) {
    Write-Check "Python safety check" "SKIP" "No requirements.txt found"
    Add-VulnResult -Name "Python-Safety" -Status "SKIP" -Details "Missing requirements.txt"
}
else {
    try {
        $safetyAvailable = & pip show safety 2>&1 | Out-String
        if ($safetyAvailable -match "Name: safety") {
            $safetyOut = & safety check -r $mlReqFile 2>&1 | Out-String
            if ($LASTEXITCODE -eq 0) {
                Write-Check "Python safety check" "PASS" "No known vulnerabilities"
                Add-VulnResult -Name "Python-Safety" -Status "PASS"
            }
            else {
                $vulnCount = ([regex]::Matches($safetyOut, "vulnerability found")).Count
                Write-Check "Python safety check" "WARN" "Vulnerabilities detected"
                Add-VulnResult -Name "Python-Safety" -Status "WARN" -Details $safetyOut.Substring(0, [Math]::Min($safetyOut.Length, 500)) -Medium $vulnCount
            }
        }
        else {
            Write-Check "Python safety check" "SKIP" "safety not installed (pip install safety)"
            Add-VulnResult -Name "Python-Safety" -Status "SKIP" -Details "Tool not installed"
        }
    }
    catch {
        Write-Check "Python safety check" "WARN" "Check failed: $($_.Exception.Message)"
        Add-VulnResult -Name "Python-Safety" -Status "WARN" -Details $_.Exception.Message
    }
}

# -- 3. Secret / Env Leak Detection --
Write-Host "`n>> 3. SECRET & ENV LEAK DETECTION" -ForegroundColor Yellow

if ($DryRun) {
    Write-Check "Env Audit" "SKIP" "[DRY-RUN] Would run: node scripts/audit_env.js"
    Write-Check "Git Secret Scan" "SKIP" "[DRY-RUN] Would check git history"
    Add-VulnResult -Name "Secret-Scan" -Status "SKIP" -Details "Dry run"
}
else {
    $auditEnvScript = "$RootPath\scripts\audit_env.js"
    if (Test-Path $auditEnvScript) {
        try {
            $envAuditOut = & node $auditEnvScript 2>&1 | Out-String
            if ($envAuditOut -match "FAIL|leaked|exposed") {
                Write-Check "Env Audit" "FAIL" "Potential secrets in .env.example"
                Add-VulnResult -Name "Env-Audit" -Status "FAIL" -Details $envAuditOut.Substring(0, [Math]::Min($envAuditOut.Length, 300)) -High 1
            }
            else {
                Write-Check "Env Audit" "PASS" ".env.example is clean"
                Add-VulnResult -Name "Env-Audit" -Status "PASS"
            }
        }
        catch {
            Write-Check "Env Audit" "WARN" "Script failed: $($_.Exception.Message)"
            Add-VulnResult -Name "Env-Audit" -Status "WARN" -Details $_.Exception.Message
        }
    }
    else {
        Write-Check "Env Audit" "SKIP" "audit_env.js not found"
        Add-VulnResult -Name "Env-Audit" -Status "SKIP" -Details "Script missing"
    }

    try {
        $gitSecrets = & git -C $RootPath log --all --diff-filter=A -p -- "*.env" "*.key" "*.pem" 2>&1 | Out-String
        if ($gitSecrets.Length -gt 100) {
            Write-Check "Git Secret Scan" "WARN" "Sensitive file patterns found in git history"
            Add-VulnResult -Name "Git-Secrets" -Status "WARN" -Details "Potential secrets in git history" -Medium 1
        }
        else {
            Write-Check "Git Secret Scan" "PASS" "No sensitive files tracked in history"
            Add-VulnResult -Name "Git-Secrets" -Status "PASS"
        }
    }
    catch {
        Write-Check "Git Secret Scan" "WARN" "Scan failed"
        Add-VulnResult -Name "Git-Secrets" -Status "WARN"
    }
}

# -- 4. Trivy Filesystem Scan --
Write-Host "`n>> 4. TRIVY FILESYSTEM SCAN" -ForegroundColor Yellow

if ($SkipTrivy) {
    Write-Check "Trivy Scan" "SKIP" "Skipped by -SkipTrivy flag"
    Add-VulnResult -Name "Trivy" -Status "SKIP" -Details "Manually skipped"
}
elseif ($DryRun) {
    Write-Check "Trivy Scan" "SKIP" "[DRY-RUN] Would run: trivy fs ."
    Add-VulnResult -Name "Trivy" -Status "SKIP" -Details "Dry run"
}
else {
    $trivyAvailable = Get-Command trivy -ErrorAction SilentlyContinue
    if ($trivyAvailable) {
        try {
            $trivyOut = & trivy fs $RootPath --scanners vuln,secret,misconfig --severity HIGH,CRITICAL -q 2>&1 | Out-String
            $trivyCritical = ([regex]::Matches($trivyOut, "CRITICAL")).Count
            $trivyHigh = ([regex]::Matches($trivyOut, "HIGH")).Count

            if ($trivyCritical -gt 0 -or $trivyHigh -gt 0) {
                $status = if ($trivyCritical -gt 0) { "CRITICAL" } else { "FAIL" }
                Write-Check "Trivy Scan" $status "CRITICAL: $trivyCritical | HIGH: $trivyHigh"
                Add-VulnResult -Name "Trivy" -Status $status -Details $trivyOut.Substring(0, [Math]::Min($trivyOut.Length, 500)) `
                    -Critical $trivyCritical -High $trivyHigh
            }
            else {
                Write-Check "Trivy Scan" "PASS" "No high/critical vulnerabilities"
                Add-VulnResult -Name "Trivy" -Status "PASS"
            }
        }
        catch {
            Write-Check "Trivy Scan" "WARN" "Scan failed: $($_.Exception.Message)"
            Add-VulnResult -Name "Trivy" -Status "WARN" -Details $_.Exception.Message
        }
    }
    else {
        Write-Check "Trivy Scan" "SKIP" "Trivy not installed (scoop install trivy)"
        Add-VulnResult -Name "Trivy" -Status "SKIP" -Details "Tool not installed"
    }
}

# -- Summary --
Write-Host ""
Write-Host ("-" * 60) -ForegroundColor Red

$summaryColor = switch ($script:Results.Status) {
    "PASS"     { "Green" }
    "CRITICAL" { "Magenta" }
    "HIGH"     { "Red" }
    "FAIL"     { "Red" }
    default    { "Yellow" }
}
$tag = switch ($script:Results.Status) {
    "PASS"     { "[OK]" }
    "CRITICAL" { "[!!]" }
    default    { "[??]" }
}

Write-Host "  $tag SECURITY: $($script:Results.Status) | C:$($script:Results.Critical) H:$($script:Results.High) M:$($script:Results.Medium) L:$($script:Results.Low) | Total: $($script:Results.TotalVulns)" -ForegroundColor $summaryColor
Write-Host ("-" * 60) -ForegroundColor Red

return $script:Results
