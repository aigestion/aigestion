#!/usr/bin/env pwsh

# =============================================================================
# GEMINI API FIX SCRIPT
# =============================================================================
# Script para reparar la configuración de Gemini API
# =============================================================================

Write-Host "🔧 GEMINI API FIX - AIGESTION" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# PASO 1: Verificar configuración actual
Write-Host "`n📋 Paso 1: Verificando configuración actual..." -ForegroundColor Yellow

$envFile = "c:\Users\Alejandro\AIGestion\.env"
if (Test-Path $envFile) {
    Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green
    $content = Get-Content $envFile
    $content | ForEach-Object {
        if ($_ -match "GOOGLE|GEMINI|API") {
            Write-Host "  → $_" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "❌ Archivo .env no encontrado" -ForegroundColor Red
    Write-Host "📝 Creando archivo .env..." -ForegroundColor Yellow
    New-Item -Path $envFile -ItemType File -Force | Out-Null
}

# PASO 2: Instrucciones para nueva API key
Write-Host "`n🔑 Paso 2: Obtener nueva API Key" -ForegroundColor Yellow
Write-Host "1. Visitar: https://aistudio.google.com/app/apikey" -ForegroundColor White
Write-Host "2. Iniciar sesión con tu cuenta Google" -ForegroundColor White
Write-Host "3. Click en 'Create API Key'" -ForegroundColor White
Write-Host "4. Copiar la nueva API key" -ForegroundColor White

# PASO 3: Actualizar configuración
Write-Host "`n⚙️ Paso 3: Actualizar configuración" -ForegroundColor Yellow
$newApiKey = Read-Host "Ingresa tu nueva API Key de Google AI Studio"

if ($newApiKey) {
    # Actualizar .env
    $envContent = @"
# =============================================================================
# GEMINI AI CONFIGURATION
# =============================================================================
GOOGLE_AI_API_KEY=$newApiKey
GEMINI_API_KEY=$newApiKey
GOOGLE_PROJECT_ID=gen-lang-client-0048282834

# =============================================================================
# MODELOS GEMINI CORRECTOS
# =============================================================================
GEMINI_MODEL_FLASH=gemini-2.0-flash-exp
GEMINI_MODEL_PRO=gemini-1.5-pro
GEMINI_MODEL_FLASH_LEGACY=gemini-1.5-flash
GEMINI_MODEL_PRO_LEGACY=gemini-1.0-pro
"@
    
    Set-Content -Path $envFile -Value $envContent -Force
    Write-Host "✅ Archivo .env actualizado" -ForegroundColor Green
    
    # Actualizar variables de entorno
    $env:GOOGLE_AI_API_KEY = $newApiKey
    $env:GEMINI_API_KEY = $newApiKey
    Write-Host "✅ Variables de entorno actualizadas" -ForegroundColor Green
} else {
    Write-Host "❌ No se ingresó API Key" -ForegroundColor Red
    exit 1
}

# PASO 4: Test de conexión
Write-Host "`n🧪 Paso 4: Test de conexión con modelos correctos" -ForegroundColor Yellow

$modelosCorrectos = @(
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro", 
    "gemini-1.5-flash",
    "gemini-1.0-pro"
)

Write-Host "📋 Modelos correctos para probar:" -ForegroundColor Cyan
$modelosCorrectos | ForEach-Object {
    Write-Host "  → $_" -ForegroundColor White
}

# PASO 5: Crear script de test
$testScript = @"
# Test Script para Gemini API
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=$newApiKey" `
-H "Content-Type: application/json" `
-d '{
  "contents": [{
    "parts":[{
      "text": "Test message - AIGestion API working!"
    }]
  }]
}'
"@

$testScript | Out-File -FilePath "c:\Users\Alejandro\AIGestion\scripts\test-gemini-api.ps1" -Encoding UTF8
Write-Host "✅ Script de test creado: test-gemini-api.ps1" -ForegroundColor Green

Write-Host "`n🎉 CONFIGURACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host "✅ Nueva API Key configurada" -ForegroundColor Green
Write-Host "✅ Modelos correctos identificados" -ForegroundColor Green
Write-Host "✅ Script de test creado" -ForegroundColor Green
Write-Host "`n🚀 Ejecuta el test con: .\scripts\test-gemini-api.ps1" -ForegroundColor Cyan
Write-Host "📋 Modelos recomendados:" -ForegroundColor Cyan
Write-Host "   • gemini-2.0-flash-exp (más rápido)" -ForegroundColor White
Write-Host "   • gemini-1.5-pro (más capaz)" -ForegroundColor White
Write-Host "   • gemini-1.5-flash (balanceado)" -ForegroundColor White
