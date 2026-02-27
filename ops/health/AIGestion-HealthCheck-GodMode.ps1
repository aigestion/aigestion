#!/usr/bin/env pwsh

# AIGestion Health Check - God Mode
# Verificacion completa del estado del sistema AIGestion

param(
    [switch]$Verbose,
    [switch]$Fix,
    [switch]$Deep
)

# Configuracion
$PROJECT_ROOT = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$FRONTEND_PATH = "$PROJECT_ROOT\frontend\apps\website-epic"
$HEALTH_REPORT = "$PROJECT_ROOT\health-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"

Write-Host "[GOD MODE] AIGestion Health Check" -ForegroundColor Cyan
Write-Host "[INFO] Proyecto: $PROJECT_ROOT" -ForegroundColor Gray

$healthReport = @{
    timestamp       = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    status          = "unknown"
    checks          = @{}
    issues          = @()
    recommendations = @()
}

function Write-HealthCheck {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [string]$Component = "General"
    )
    $color = switch ($Level) {
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        "ERROR"   { "Red" }
        "INFO"    { "White" }
        default   { "Gray" }
    }
    Write-Host "[$Level] ${Component}: $Message" -ForegroundColor $color
    $healthReport.checks[$Component] = @{
        status    = $Level
        message   = $Message
        timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
    if ($Level -in @("WARNING", "ERROR")) {
        $healthReport.issues += @{
            component = $Component
            level     = $Level
            message   = $Message
        }
    }
}

# 1. Git
Write-Host "
[STEP 1] Verificando Git..." -ForegroundColor Yellow
Set-Location $PROJECT_ROOT
try {
    $gitStatus = git status --porcelain
    $gitBranch = git rev-parse --abbrev-ref HEAD
    $gitRemote = git remote get-url origin
    if ($gitStatus) { Write-HealthCheck "Hay cambios sin commit" "WARNING" "Git" }
    else { Write-HealthCheck "Repositorio limpio" "SUCCESS" "Git" }
    Write-HealthCheck "Rama actual: $gitBranch" "INFO" "Git"
    Write-HealthCheck "Remote: $gitRemote" "INFO" "Git"
} catch { Write-HealthCheck "Error verificando Git: $($_.Exception.Message)" "ERROR" "Git" }

# 2. Node.js
Write-Host "
[STEP 2] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion  = npm --version
    Write-HealthCheck "Node.js: $nodeVersion" "SUCCESS" "Node.js"
    Write-HealthCheck "NPM: $npmVersion" "SUCCESS" "Node.js"
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($nodeMajor -lt 18) { Write-HealthCheck "Node.js version recomendada: 18+" "WARNING" "Node.js" }
} catch { Write-HealthCheck "Node.js no instalado" "ERROR" "Node.js" }

# 3. Dependencias
Write-Host "
[STEP 3] Verificando dependencias..." -ForegroundColor Yellow
Set-Location $FRONTEND_PATH
try {
    if (Test-Path "package.json") {
        Write-HealthCheck "package.json encontrado" "SUCCESS" "Dependencies"
        if (Test-Path "node_modules") {
            Write-HealthCheck "node_modules existe" "SUCCESS" "Dependencies"
            $criticalDeps = @("react", "react-dom", "vite")
            foreach ($dep in $criticalDeps) {
                if (Test-Path "node_modules\$dep") { Write-HealthCheck "$dep instalado" "SUCCESS" "Dependencies" }
                else { Write-HealthCheck "$dep no encontrado" "ERROR" "Dependencies" }
            }
        } else {
            Write-HealthCheck "node_modules no existe - ejecutar npm install" "ERROR" "Dependencies"
            if ($Fix) { npm install }
        }
    } else { Write-HealthCheck "package.json no encontrado" "ERROR" "Dependencies" }
} catch { Write-HealthCheck "Error verificando dependencias: $($_.Exception.Message)" "ERROR" "Dependencies" }

# 4. Build
Write-Host "
[STEP 4] Verificando build..." -ForegroundColor Yellow
try {
    if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }
    Write-Host "Ejecutando build..." -ForegroundColor Gray
    $buildResult = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-HealthCheck "Build exitoso" "SUCCESS" "Build"
        $criticalFiles = @("index.html", "assets")
        foreach ($file in $criticalFiles) {
            if (Test-Path "dist\$file") { Write-HealthCheck "$file generado" "SUCCESS" "Build" }
            else { Write-HealthCheck "$file no encontrado" "ERROR" "Build" }
        }
        $distSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-HealthCheck "Tamano del build: $([math]::Round($distSize, 2)) MB" "INFO" "Build"
    } else {
        Write-HealthCheck "Build fallo" "ERROR" "Build"
        if ($Verbose) { Write-Host $buildResult -ForegroundColor Red }
    }
} catch { Write-HealthCheck "Error en build: $($_.Exception.Message)" "ERROR" "Build" }

# 5. Configuracion
Write-Host "
[STEP 5] Verificando configuracion..." -ForegroundColor Yellow
try {
    # Single source of truth: only root .env (no .env.local or .env.production)
    $rootEnv = Join-Path $PROJECT_ROOT ".env"
    if (Test-Path $rootEnv) {
        $envLineCount = (Get-Content $rootEnv | Measure-Object -Line).Lines
        Write-HealthCheck ".env encontrado ($envLineCount lineas)" "SUCCESS" "Config"
        # Check for unrestored placeholders
        $envRaw = Get-Content $rootEnv -Raw
        $redacted = ([regex]::Matches($envRaw, '\[REDACTED\]|NEEDS_RESTORE_FROM_PLATFORM', 'IgnoreCase')).Count
        if ($redacted -gt 0) { Write-HealthCheck "$redacted credenciales sin restaurar en .env" "WARNING" "Config" }
        else { Write-HealthCheck "Credenciales .env: validadas" "SUCCESS" "Config" }
    }
    else {
        Write-HealthCheck ".env NO ENCONTRADO (CRITICO)" "ERROR" "Config"
    }
    if (Test-Path "vite.config.ts") { Write-HealthCheck "vite.config.ts encontrado" "SUCCESS" "Config" }
    else { Write-HealthCheck "vite.config.ts no encontrado" "ERROR" "Config" }
} catch { Write-HealthCheck "Error verificando configuracion: $($_.Exception.Message)" "ERROR" "Config" }

# 6. Seguridad (deep mode)
if ($Deep) {
    Write-Host "
[STEP 6] Verificacion de seguridad..." -ForegroundColor Yellow
    try {
        $auditResult = npm audit --json 2>&1 | ConvertFrom-Json
        if ($auditResult.vulnerabilities) {
            $vulnCount = $auditResult.vulnerabilities.PSObject.Properties.Count
            if ($vulnCount -gt 0) {
                Write-HealthCheck "$vulnCount vulnerabilities encontradas" "WARNING" "Security"
                if ($Fix) { npm audit fix }
            } else { Write-HealthCheck "No se encontraron vulnerabilities" "SUCCESS" "Security" }
        }
    } catch { Write-HealthCheck "Error en verificacion de seguridad: $($_.Exception.Message)" "WARNING" "Security" }
}

# 7. Performance
Write-Host "
[STEP 7] Verificacion de performance..." -ForegroundColor Yellow
try {
    if (Test-Path "dist") {
        $jsFiles  = Get-ChildItem "dist\assets\*.js"  -ErrorAction SilentlyContinue
        $cssFiles = Get-ChildItem "dist\assets\*.css" -ErrorAction SilentlyContinue
        $totalJs  = if ($jsFiles)  { ($jsFiles  | Measure-Object -Property Length -Sum).Sum / 1MB } else { 0 }
        $totalCss = if ($cssFiles) { ($cssFiles | Measure-Object -Property Length -Sum).Sum / 1MB } else { 0 }
        Write-HealthCheck "JS total: $([math]::Round($totalJs,2)) MB" "INFO" "Performance"
        Write-HealthCheck "CSS total: $([math]::Round($totalCss,2)) MB" "INFO" "Performance"
        $largeFiles = $jsFiles | Where-Object { $_.Length / 1MB -gt 1 }
        if ($largeFiles) { Write-HealthCheck "$($largeFiles.Count) archivos JS > 1MB" "WARNING" "Performance" }
        else { Write-HealthCheck "Archivos JS optimizados" "SUCCESS" "Performance" }
    }
} catch { Write-HealthCheck "Error verificando performance: $($_.Exception.Message)" "ERROR" "Performance" }

# Reporte final
$errorCount   = ($healthReport.issues | Where-Object { $_.level -eq "ERROR" }).Count
$warningCount = ($healthReport.issues | Where-Object { $_.level -eq "WARNING" }).Count

if ($errorCount -eq 0 -and $warningCount -eq 0) {
    $healthReport.status = "healthy"
    Write-Host "
[OK] Sistema saludable!" -ForegroundColor Green
} elseif ($errorCount -eq 0) {
    $healthReport.status = "warning"
    Write-Host "
[WARNING] Sistema con advertencias" -ForegroundColor Yellow
} else {
    $healthReport.status = "error"
    Write-Host "
[ERROR] Sistema con errores" -ForegroundColor Red
}

$healthReport | ConvertTo-Json -Depth 10 | Out-File $HEALTH_REPORT -Encoding UTF8
Write-Host "[INFO] Reporte guardado: $HEALTH_REPORT" -ForegroundColor Gray

Write-Host "
[SUMMARY] Health Check AIGestion:" -ForegroundColor Cyan
Write-Host "  OK       : $(($healthReport.checks.Values | Where-Object { $_.status -eq 'SUCCESS' }).Count)" -ForegroundColor Green
Write-Host "  Warnings : $warningCount" -ForegroundColor Yellow
Write-Host "  Errors   : $errorCount" -ForegroundColor Red

if ($healthReport.issues.Count -gt 0) {
    Write-Host "
[ISSUES]" -ForegroundColor Yellow
    foreach ($issue in $healthReport.issues) {
        $col = if ($issue.level -eq 'ERROR') { 'Red' } else { 'Yellow' }
        Write-Host "  [$($issue.level)] $($issue.component): $($issue.message)" -ForegroundColor $col
    }
}

Write-Host "
[DONE] AIGestion Health Check completado!" -ForegroundColor Green
