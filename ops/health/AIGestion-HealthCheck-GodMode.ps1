#!/usr/bin/env pwsh

# AIGestion Health Check - God Mode
# Verificación completa del estado del sistema AIGestion

param(
    [switch]$Verbose,
    [switch]$Fix,
    [switch]$Deep
)

# Configuración
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
$FRONTEND_PATH = "$PROJECT_ROOT\frontend\website-epic"
$HEALTH_REPORT = "$PROJECT_ROOT\health-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"

Write-Host "🏥 AIGestion Health Check God Mode" -ForegroundColor Cyan
Write-Host "📂 Proyecto: $PROJECT_ROOT" -ForegroundColor Gray

# Inicializar reporte
$healthReport = @{
    timestamp       = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    status          = "unknown"
    checks          = @{}
    issues          = @()
    recommendations = @()
}

# Función de logging
function Write-HealthCheck {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [string]$Component = "General"
    )

    $color = switch ($Level) {
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        "ERROR" { "Red" }
        "INFO" { "White" }
        default { "Gray" }
    }

    Write-Host "[$Level] $Component`: $Message" -ForegroundColor $color

    # Agregar al reporte
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

# 1. Verificación de Git
Write-Host "`n📋 Paso 1: Verificando Git..." -ForegroundColor Yellow
Set-Location $PROJECT_ROOT

try {
    $gitStatus = git status --porcelain
    $gitBranch = git rev-parse --abbrev-ref HEAD
    $gitRemote = git remote get-url origin

    if ($gitStatus) {
        Write-HealthCheck "Hay cambios sin commit" "WARNING" "Git"
    }
    else {
        Write-HealthCheck "Repositorio limpio" "SUCCESS" "Git"
    }

    Write-HealthCheck "Rama actual: $gitBranch" "INFO" "Git"
    Write-HealthCheck "Remote: $gitRemote" "INFO" "Git"

}
catch {
    Write-HealthCheck "Error verificando Git: $($_.Exception.Message)" "ERROR" "Git"
}

# 2. Verificación de Node.js
Write-Host "`n📋 Paso 2: Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version

    Write-HealthCheck "Node.js: $nodeVersion" "SUCCESS" "Node.js"
    Write-HealthCheck "NPM: $npmVersion" "SUCCESS" "Node.js"

    # Verificar versión mínima
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($nodeMajor -lt 18) {
        Write-HealthCheck "Node.js versión recomendada: 18+" "WARNING" "Node.js"
    }

}
catch {
    Write-HealthCheck "Node.js no instalado" "ERROR" "Node.js"
}

# 3. Verificación de dependencias
Write-Host "`n📋 Paso 3: Verificando dependencias..." -ForegroundColor Yellow
Set-Location $FRONTEND_PATH

try {
    if (Test-Path "package.json") {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        Write-HealthCheck "package.json encontrado" "SUCCESS" "Dependencies"

        if (Test-Path "node_modules") {
            Write-HealthCheck "node_modules existe" "SUCCESS" "Dependencies"

            # Verificar dependencias críticas
            $criticalDeps = @("react", "react-dom", "vite", "@supabase/supabase-js")
            foreach ($dep in $criticalDeps) {
                $depPath = "node_modules\$dep"
                if (Test-Path $depPath) {
                    Write-HealthCheck "$dep instalado" "SUCCESS" "Dependencies"
                }
                else {
                    Write-HealthCheck "$dep no encontrado" "ERROR" "Dependencies"
                }
            }
        }
        else {
            Write-HealthCheck "node_modules no existe - ejecutar npm install" "ERROR" "Dependencies"
            if ($Fix) {
                Write-Host "🔧 Instalando dependencias..." -ForegroundColor Yellow
                npm install
            }
        }
    }
    else {
        Write-HealthCheck "package.json no encontrado" "ERROR" "Dependencies"
    }
}
catch {
    Write-HealthCheck "Error verificando dependencias: $($_.Exception.Message)" "ERROR" "Dependencies"
}

# 4. Verificación de build
Write-Host "`n📋 Paso 4: Verificando build..." -ForegroundColor Yellow
try {
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force
    }

    Write-Host "🔨 Ejecutando build..." -ForegroundColor Gray
    $buildResult = npm run build 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-HealthCheck "Build exitoso" "SUCCESS" "Build"

        # Verificar archivos críticos
        $criticalFiles = @("index.html", "assets")
        foreach ($file in $criticalFiles) {
            $filePath = "dist\$file"
            if (Test-Path $filePath) {
                Write-HealthCheck "$file generado" "SUCCESS" "Build"
            }
            else {
                Write-HealthCheck "$file no encontrado" "ERROR" "Build"
            }
        }

        # Analizar tamaño del build
        $distSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-HealthCheck "Tamaño del build: $([math]::Round($distSize, 2)) MB" "INFO" "Build"

    }
    else {
        Write-HealthCheck "Build falló" "ERROR" "Build"
        if ($Verbose) {
            Write-Host $buildResult -ForegroundColor Red
        }
    }
}
catch {
    Write-HealthCheck "Error en build: $($_.Exception.Message)" "ERROR" "Build"
}

# 5. Verificación de configuración
Write-Host "`n📋 Paso 5: Verificando configuración..." -ForegroundColor Yellow
try {
    # Verificar variables de entorno
    $envFiles = @(".env", ".env.local", ".env.production")
    foreach ($envFile in $envFiles) {
        if (Test-Path $envFile) {
            Write-HealthCheck "$envFile encontrado" "SUCCESS" "Config"
        }
        else {
            Write-HealthCheck "$envFile no encontrado" "WARNING" "Config"
        }
    }

    # Verificar configuración de Vite
    if (Test-Path "vite.config.ts") {
        Write-HealthCheck "vite.config.ts encontrado" "SUCCESS" "Config"
    }
    else {
        Write-HealthCheck "vite.config.ts no encontrado" "ERROR" "Config"
    }

}
catch {
    Write-HealthCheck "Error verificando configuración: $($_.Exception.Message)" "ERROR" "Config"
}

# 6. Verificación de seguridad (deep mode)
if ($Deep) {
    Write-Host "`n📋 Paso 6: Verificación de seguridad..." -ForegroundColor Yellow
    try {
        # Verificar vulnerabilities
        $auditResult = npm audit --json 2>&1 | ConvertFrom-Json

        if ($auditResult.vulnerabilities) {
            $vulnCount = $auditResult.vulnerabilities.PSObject.Properties.Count
            if ($vulnCount -gt 0) {
                Write-HealthCheck "$vulnCount vulnerabilities encontradas" "WARNING" "Security"
                if ($Fix) {
                    Write-Host "🔧 Ejecutando npm audit fix..." -ForegroundColor Yellow
                    npm audit fix
                }
            }
            else {
                Write-HealthCheck "No se encontraron vulnerabilities" "SUCCESS" "Security"
            }
        }

        # Verificar dependencias obsoletas
        $outdatedResult = npm outdated 2>&1
        if ($outdatedResult -and $outdatedResult -notmatch "up to date") {
            Write-HealthCheck "Hay dependencias obsoletas" "WARNING" "Security"
        }
        else {
            Write-HealthCheck "Dependencias actualizadas" "SUCCESS" "Security"
        }

    }
    catch {
        Write-HealthCheck "Error en verificación de seguridad: $($_.Exception.Message)" "WARNING" "Security"
    }
}

# 7. Verificación de performance
Write-Host "`n📋 Paso 7: Verificación de performance..." -ForegroundColor Yellow
try {
    if (Test-Path "dist") {
        # Analizar bundle size
        $jsFiles = Get-ChildItem "dist\assets\*.js"
        $cssFiles = Get-ChildItem "dist\assets\*.css"

        $totalJsSize = ($jsFiles | Measure-Object -Property Length -Sum).Sum / 1MB
        $totalCssSize = ($cssFiles | Measure-Object -Property Length -Sum).Sum / 1MB

        Write-HealthCheck "JS total: $([math]::Round($totalJsSize, 2)) MB" "INFO" "Performance"
        Write-HealthCheck "CSS total: $([math]::Round($totalCssSize, 2)) MB" "INFO" "Performance"

        # Verificar optimización
        $largeFiles = $jsFiles | Where-Object { $_.Length / 1MB -gt 1 }
        if ($largeFiles) {
            Write-HealthCheck "$($largeFiles.Count) archivos JS > 1MB" "WARNING" "Performance"
        }
        else {
            Write-HealthCheck "Archivos JS optimizados" "SUCCESS" "Performance"
        }
    }
}
catch {
    Write-HealthCheck "Error verificando performance: $($_.Exception.Message)" "ERROR" "Performance"
}

# Generar reporte final
$errorCount = ($healthReport.issues | Where-Object { $_.level -eq "ERROR" }).Count
$warningCount = ($healthReport.issues | Where-Object { $_.level -eq "WARNING" }).Count

if ($errorCount -eq 0 -and $warningCount -eq 0) {
    $healthReport.status = "healthy"
    Write-Host "`n✅ Sistema saludable!" -ForegroundColor Green
}
elseif ($errorCount -eq 0) {
    $healthReport.status = "warning"
    Write-Host "`n⚠️  Sistema con advertencias" -ForegroundColor Yellow
}
else {
    $healthReport.status = "error"
    Write-Host "`n❌ Sistema con errores" -ForegroundColor Red
}

# Guardar reporte
$healthReport | ConvertTo-Json -Depth 10 | Out-File $HEALTH_REPORT
Write-Host "📊 Reporte guardado: $HEALTH_REPORT" -ForegroundColor Gray

# Resumen
Write-Host "`n📋 Resumen del Health Check:" -ForegroundColor Cyan
Write-Host "✅ Éxitos: $(($healthReport.checks.Values | Where-Object { $_.status -eq 'SUCCESS' }).Count)" -ForegroundColor Green
Write-Host "⚠️  Advertencias: $warningCount" -ForegroundColor Yellow
Write-Host "❌ Errores: $errorCount" -ForegroundColor Red

if ($healthReport.issues.Count -gt 0) {
    Write-Host "`n🔍 Issues encontrados:" -ForegroundColor Yellow
    foreach ($issue in $healthReport.issues) {
        switch ($issue.level) {
            'ERROR'   { $color = 'Red' }
            'WARNING' { $color = 'Yellow' }
            default   { $color = 'Gray' }
        }
        Write-Host "  [$($issue.level)] $($issue.component): $($issue.message)" -ForegroundColor $color
    }
}

Write-Host "`n🎉 AIGestion Health Check completado!" -ForegroundColor Green
