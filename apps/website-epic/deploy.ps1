#!/usr/bin/env pwsh
# Deploy Script - AIGestion Website Epic con Daniela Neural System
# Nivel Dios Integration 🚀

param(
    [switch]$SkipBuild,
    [switch]$Production
)

$ErrorActionPreference = "Stop"

Write-Host @"
╔════════════════════════════════════════════════════════════╗
║  🧠 AIGestion - Daniela Neural System Deployment          ║
║  Integración Vapi Nivel Dios                              ║
╚════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# 1. Verificar que existe .env con claves
Write-Host "`n📋 Verificando configuración..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "❌ Archivo .env no encontrado" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch "VITE_VAPI_PUBLIC_KEY=8cec0d91") {
    Write-Host "⚠️  ADVERTENCIA: Clave pública de Vapi no actualizada" -ForegroundColor Yellow
}

Write-Host "✅ Configuración verificada" -ForegroundColor Green

# 2. Build
if (-not $SkipBuild) {
    Write-Host "`n🔨 Construyendo aplicación..." -ForegroundColor Yellow
    pnpm run build

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build falló" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ Build exitoso" -ForegroundColor Green

    # Verificar tamaño del bundle
    $distSize = (Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   📦 Tamaño total: $([math]::Round($distSize, 2)) MB" -ForegroundColor Cyan

    # Verificar archivos críticos
    $criticalFiles = @("index.html", "assets")
    foreach ($file in $criticalFiles) {
        if (-not (Test-Path "dist\$file")) {
            Write-Host "❌ Archivo crítico faltante: $file" -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "`n⏭️  Saltando build (usando dist existente)" -ForegroundColor Yellow
}

# 3. Copiar archivos de sonido
Write-Host "`n🔊 Verificando archivos de audio..." -ForegroundColor Yellow
$soundsSource = "..\..\..\..\sounds"
$soundsDest = "dist\sounds"

if (Test-Path $soundsSource) {
    if (-not (Test-Path $soundsDest)) {
        New-Item -ItemType Directory -Path $soundsDest -Force | Out-Null
    }
    Copy-Item "$soundsSource\*.mp3" -Destination $soundsDest -Force
    Write-Host "✅ Archivos de audio copiados" -ForegroundColor Green
} else {
    Write-Host "⚠️  Carpeta sounds no encontrada" -ForegroundColor Yellow
}

# 4. Deploy
Write-Host "`n🚀 Desplegando a Netlify..." -ForegroundColor Yellow

if ($Production) {
    Write-Host "   🌍 PRODUCCIÓN - https://aigestion.net" -ForegroundColor Magenta
    netlify deploy --prod --dir=dist
} else {
    Write-Host "   🧪 PREVIEW" -ForegroundColor Cyan
    netlify deploy --dir=dist
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Deployment falló" -ForegroundColor Red
    exit 1
}

Write-Host @"

╔════════════════════════════════════════════════════════════╗
║  ✅ DEPLOYMENT COMPLETADO                                  ║
║                                                            ║
║  🧠 Daniela Neural System está ONLINE                     ║
║  🎤 Vapi Voice AI integrado                               ║
║  🔊 Sistema de audio configurado                          ║
║                                                            ║
║  Verifica en: https://aigestion.net                       ║
║  Consola de navegador para logs de Vapi                   ║
╚════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green

# 5. Instrucciones de verificación
Write-Host "`n📝 CHECKLIST DE VERIFICACIÓN:" -ForegroundColor Yellow
Write-Host "  ☐ Abrir consola del navegador (F12)" -ForegroundColor White
Write-Host "  ☐ Verificar: [Vapi] SDK initialized successfully" -ForegroundColor White
Write-Host "  ☐ Click en 'HABLAR CON DANIELA'" -ForegroundColor White
Write-Host "  ☐ Permitir acceso al micrófono" -ForegroundColor White
Write-Host "  ☐ Verificar: [Vapi] Call started" -ForegroundColor White
Write-Host "  ☐ Hablar con Daniela y verificar respuesta" -ForegroundColor White
Write-Host "  ☐ Verificar que los sonidos se reproducen (click, hover)" -ForegroundColor White
