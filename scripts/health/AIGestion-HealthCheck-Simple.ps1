#!/usr/bin/env pwsh

# AIGestion Health Check - Simple Version
param(
    [switch]$Verbose
)

$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
$FRONTEND_PATH = "$PROJECT_ROOT\frontend\website-epic"

Write-Host "🏥 AIGestion Health Check" -ForegroundColor Cyan

# 1. Verificar Git
Write-Host "`n📋 Git Status:" -ForegroundColor Yellow
Set-Location $PROJECT_ROOT
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "❌ Hay cambios sin commit" -ForegroundColor Red
} else {
    Write-Host "✅ Repositorio limpio" -ForegroundColor Green
}

# 2. Verificar Node.js
Write-Host "`n📋 Node.js:" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado" -ForegroundColor Red
}

# 3. Verificar dependencias
Write-Host "`n📋 Dependencias:" -ForegroundColor Yellow
Set-Location $FRONTEND_PATH
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules no existe" -ForegroundColor Red
}

# 4. Verificar build
Write-Host "`n📋 Build:" -ForegroundColor Yellow
try {
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force
    }
    
    Write-Host "🔨 Ejecutando build..." -ForegroundColor Gray
    $buildResult = npm run build 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build exitoso" -ForegroundColor Green
        
        # Verificar archivos críticos
        if (Test-Path "dist\index.html") {
            Write-Host "✅ index.html generado" -ForegroundColor Green
        } else {
            Write-Host "❌ index.html no encontrado" -ForegroundColor Red
        }
        
        # Analizar tamaño
        $distSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "📊 Tamaño: $([math]::Round($distSize, 2)) MB" -ForegroundColor Gray
        
    } else {
        Write-Host "❌ Build falló" -ForegroundColor Red
        if ($Verbose) {
            Write-Host $buildResult -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ Error en build: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Health Check completado!" -ForegroundColor Green
