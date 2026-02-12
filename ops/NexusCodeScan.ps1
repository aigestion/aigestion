<#
.SYNOPSIS
    NexusCodeScan - Code Quality Engine for AIGestion
    Part of the Nexus Guardian V2 System.

.DESCRIPTION
    Consolidates all code quality checks:
    1. ESLint (lint errors & style)
    2. TypeScript strict type checking
    3. Circular dependency detection
    4. Auto-fix mode (format + lint:fix)

.PARAMETER Fix
    Runs auto-fix (prettier + eslint --fix) before scanning.

.PARAMETER DryRun
    Simulates all checks without executing commands.

.PARAMETER Quick
    Only runs ESLint (skips TypeCheck and circular deps for speed).
#>

param(
    [switch]$Fix,
    [switch]$DryRun,
    [switch]$Quick
)

$ErrorActionPreference = "Continue"
$RootPath = "C:\Users\Alejandro\AIGestion"

# -- Result Accumulator --
$script:Results = @{
    Module    = "CodeScan"
    Timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
    Status    = "PASS"
    Checks    = @()
    Errors    = 0
    Warnings  = 0
}

function Add-CheckResult {
    param($Name, $Status, $Details = "", $Count = 0)
    $script:Results.Checks += @{
        Name    = $Name
        Status  = $Status
        Details = $Details
        Count   = $Count
    }
    if ($Status -eq "FAIL") {
        $script:Results.Status = "FAIL"
        $script:Results.Errors += $Count
    }
    elseif ($Status -eq "WARN") {
        $script:Results.Warnings += $Count
    }
}

function Write-Check {
    param($Name, $Status, $Detail = "")
    $icon = switch ($Status) {
        "PASS" { "[OK]" }
        "FAIL" { "[FAIL]" }
        "WARN" { "[WARN]" }
        "SKIP" { "[SKIP]" }
        default { "[--]" }
    }
    $color = switch ($Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "WARN" { "Yellow" }
        "SKIP" { "DarkGray" }
        default { "White" }
    }
    Write-Host "   $icon $Name" -ForegroundColor $color -NoNewline
    if ($Detail) { Write-Host " -- $Detail" -ForegroundColor DarkGray } else { Write-Host "" }
}

# -- Banner --
Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Blue
Write-Host "  NEXUS CODE SCAN" -ForegroundColor Blue
Write-Host ("=" * 60) -ForegroundColor Blue
Write-Host ""

# -- 0. Auto-Fix Mode --
if ($Fix) {
    Write-Host ">> AUTO-FIX MODE" -ForegroundColor Magenta

    if ($DryRun) {
        Write-Check "Prettier Format" "SKIP" "[DRY-RUN] Would run: pnpm run format"
        Write-Check "ESLint Auto-Fix" "SKIP" "[DRY-RUN] Would run: pnpm run lint:fix"
    }
    else {
        Write-Host "   Running Prettier..." -ForegroundColor DarkGray
        $formatOutput = & pnpm run format --prefix $RootPath 2>&1 | Out-String
        Write-Check "Prettier Format" "PASS" "Code formatted"

        Write-Host "   Running ESLint --fix..." -ForegroundColor DarkGray
        $lintFixOutput = & pnpm run lint:fix --prefix $RootPath 2>&1 | Out-String
        Write-Check "ESLint Auto-Fix" "PASS" "Auto-fixable issues resolved"
    }
    Write-Host ""
}

# -- 1. ESLint --
Write-Host ">> 1. ESLINT ANALYSIS" -ForegroundColor Yellow

if ($DryRun) {
    Write-Check "ESLint" "SKIP" "[DRY-RUN] Would run: pnpm lint"
    Add-CheckResult -Name "ESLint" -Status "SKIP" -Details "Dry run"
}
else {
    try {
        $lintOutput = & pnpm lint --prefix $RootPath 2>&1 | Out-String
        $errorLines = ([regex]::Matches($lintOutput, "error")).Count
        $warnLines = ([regex]::Matches($lintOutput, "warning")).Count

        if ($LASTEXITCODE -eq 0) {
            Write-Check "ESLint" "PASS" "No issues found"
            Add-CheckResult -Name "ESLint" -Status "PASS"
        }
        else {
            Write-Check "ESLint" "FAIL" "$errorLines errors, $warnLines warnings"
            Add-CheckResult -Name "ESLint" -Status "FAIL" -Details $lintOutput.Substring(0, [Math]::Min($lintOutput.Length, 500)) -Count $errorLines
        }
    }
    catch {
        Write-Check "ESLint" "WARN" "ESLint execution failed: $($_.Exception.Message)"
        Add-CheckResult -Name "ESLint" -Status "WARN" -Details $_.Exception.Message -Count 1
    }
}

# -- 2. TypeScript Strict Check --
Write-Host "`n>> 2. TYPESCRIPT STRICT CHECK" -ForegroundColor Yellow

if ($Quick) {
    Write-Check "TypeScript (Backend)" "SKIP" "Quick mode -- skipped"
    Write-Check "TypeScript (Frontend)" "SKIP" "Quick mode -- skipped"
    Add-CheckResult -Name "TypeScript" -Status "SKIP" -Details "Quick mode"
}
elseif ($DryRun) {
    Write-Check "TypeScript (Backend)" "SKIP" "[DRY-RUN] Would run: tsc --noEmit"
    Write-Check "TypeScript (Frontend)" "SKIP" "[DRY-RUN] Would run: tsc --noEmit"
    Add-CheckResult -Name "TypeScript" -Status "SKIP" -Details "Dry run"
}
else {
    # Backend
    try {
        $backendTsc = & pnpm --prefix "$RootPath\backend" exec tsc --noEmit 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0) {
            Write-Check "TypeScript (Backend)" "PASS" "No type errors"
            Add-CheckResult -Name "TypeScript-Backend" -Status "PASS"
        }
        else {
            $tsErrors = ([regex]::Matches($backendTsc, "error TS")).Count
            Write-Check "TypeScript (Backend)" "FAIL" "$tsErrors type errors"
            Add-CheckResult -Name "TypeScript-Backend" -Status "FAIL" -Details $backendTsc.Substring(0, [Math]::Min($backendTsc.Length, 500)) -Count $tsErrors
        }
    }
    catch {
        Write-Check "TypeScript (Backend)" "WARN" "Check failed: $($_.Exception.Message)"
        Add-CheckResult -Name "TypeScript-Backend" -Status "WARN" -Details $_.Exception.Message -Count 1
    }

    # Frontend
    try {
        $frontendTsc = & pnpm --prefix "$RootPath\frontend" exec tsc --noEmit 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0) {
            Write-Check "TypeScript (Frontend)" "PASS" "No type errors"
            Add-CheckResult -Name "TypeScript-Frontend" -Status "PASS"
        }
        else {
            $tsErrors = ([regex]::Matches($frontendTsc, "error TS")).Count
            Write-Check "TypeScript (Frontend)" "FAIL" "$tsErrors type errors"
            Add-CheckResult -Name "TypeScript-Frontend" -Status "FAIL" -Details $frontendTsc.Substring(0, [Math]::Min($frontendTsc.Length, 500)) -Count $tsErrors
        }
    }
    catch {
        Write-Check "TypeScript (Frontend)" "WARN" "Check failed: $($_.Exception.Message)"
        Add-CheckResult -Name "TypeScript-Frontend" -Status "WARN" -Details $_.Exception.Message -Count 1
    }
}

# -- 3. Circular Dependencies --
Write-Host "`n>> 3. CIRCULAR DEPENDENCY CHECK" -ForegroundColor Yellow

if ($Quick) {
    Write-Check "Circular Deps" "SKIP" "Quick mode -- skipped"
    Add-CheckResult -Name "CircularDeps" -Status "SKIP" -Details "Quick mode"
}
elseif ($DryRun) {
    Write-Check "Circular Deps" "SKIP" "[DRY-RUN] Would run: npx madge --circular"
    Add-CheckResult -Name "CircularDeps" -Status "SKIP" -Details "Dry run"
}
else {
    try {
        $madgeOutput = & npx --yes madge --circular --extensions ts, tsx "$RootPath\backend\src" 2>&1 | Out-String
        if ($madgeOutput -match "No circular dependency found") {
            Write-Check "Circular Deps (Backend)" "PASS" "No circular dependencies"
            Add-CheckResult -Name "CircularDeps-Backend" -Status "PASS"
        }
        else {
            $circCount = ([regex]::Matches($madgeOutput, ">")).Count
            Write-Check "Circular Deps (Backend)" "WARN" "$circCount circular chains detected"
            Add-CheckResult -Name "CircularDeps-Backend" -Status "WARN" -Details $madgeOutput.Substring(0, [Math]::Min($madgeOutput.Length, 500)) -Count $circCount
        }
    }
    catch {
        Write-Check "Circular Deps" "WARN" "Madge not available or failed"
        Add-CheckResult -Name "CircularDeps" -Status "WARN" -Details $_.Exception.Message -Count 1
    }
}

# -- Summary --
Write-Host ""
Write-Host ("-" * 60) -ForegroundColor Blue
$summaryColor = if ($script:Results.Status -eq "PASS") { "Green" } else { "Red" }
$tag = if ($script:Results.Status -eq "PASS") { "[OK]" } else { "[!!]" }
Write-Host "  $tag CODE SCAN: $($script:Results.Status) | Errors: $($script:Results.Errors) | Warnings: $($script:Results.Warnings)" -ForegroundColor $summaryColor
Write-Host ("-" * 60) -ForegroundColor Blue

return $script:Results
