#!/usr/bin/env pwsh

# =============================================================================
# GEMINI MODELS TEST SCRIPT - FIXED
# =============================================================================
# Script para probar todos los modelos Gemini configurados
# =============================================================================

Write-Host "🧪 GEMINI MODELS TEST - AIGESTION" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Cargar variables de entorno
$envFile = "c:\Users\Alejandro\AIGestion\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    Write-Host "✅ Variables de entorno cargadas" -ForegroundColor Green
} else {
    Write-Host "❌ Archivo .env no encontrado" -ForegroundColor Red
    exit 1
}

# Modelos a probar
$modelos = @(
    @{ Name = "Gemini 2.0 Flash Exp"; Model = "gemini-2.0-flash-exp"; Key = $env:GOOGLE_AI_API_KEY },
    @{ Name = "Gemini 1.5 Pro"; Model = "gemini-1.5-pro"; Key = $env:GOOGLE_AI_API_KEY },
    @{ Name = "Gemini 1.5 Flash"; Model = "gemini-1.5-flash"; Key = $env:GOOGLE_AI_API_KEY },
    @{ Name = "Gemini 1.0 Pro"; Model = "gemini-1.0-pro"; Key = $env:GOOGLE_AI_API_KEY }
)

Write-Host "`n📋 Modelos a probar:" -ForegroundColor Yellow
$modelos | ForEach-Object { Write-Host "  → $($_.Name)" -ForegroundColor White }

# Función para probar modelo
function Test-GeminiModel {
    param(
        [string]$ModelName,
        [string]$Model,
        [string]$ApiKey
    )
    
    Write-Host "`n🔍 Probando: $ModelName" -ForegroundColor Yellow
    Write-Host "   Modelo: $Model" -ForegroundColor Gray
    
    $body = @{
        contents = @(
            @{
                parts = @(
                    @{
                        text = "Responde: 'AIGestion API funcionando correctamente' en español."
                    }
                )
            }
        )
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/$($Model):generateContent?key=$ApiKey" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -TimeoutSec 30 `
            -ErrorAction Stop
        
        $text = $response.candidates[0].content.parts[0].text
        Write-Host "   ✅ Éxito: $text" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Message -match "404") {
            Write-Host "   💡 Modelo no encontrado o nombre incorrecto" -ForegroundColor Yellow
        } elseif ($_.Exception.Message -match "403") {
            Write-Host "   💡 API key inválida o leaked" -ForegroundColor Yellow
        } elseif ($_.Exception.Message -match "429") {
            Write-Host "   💡 Rate limit excedido" -ForegroundColor Yellow
        }
        return $false
    }
}

# Probar cada modelo
$resultados = @()
foreach ($modelo in $modelos) {
    $resultado = Test-GeminiModel -ModelName $modelo.Name -Model $modelo.Model -ApiKey $modelo.Key
    $resultados += @{
        Name = $modelo.Name
        Model = $modelo.Model
        Success = $resultado
    }
    Start-Sleep -Seconds 1  # Evitar rate limiting
}

# Resumen
Write-Host "`n📊 RESUMEN DE RESULTADOS" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

$exitosos = 0
$resultados | ForEach-Object {
    if ($_.Success) {
        Write-Host "✅ $($_.Name) - $($_.Model)" -ForegroundColor Green
        $exitosos++
    } else {
        Write-Host "❌ $($_.Name) - $($_.Model)" -ForegroundColor Red
    }
}

Write-Host "`n📈 Estadísticas:" -ForegroundColor Yellow
Write-Host "   Total modelos: $($resultados.Count)" -ForegroundColor White
Write-Host "   Funcionando: $exitosos" -ForegroundColor Green
Write-Host "   Fallidos: $($resultados.Count - $exitosos)" -ForegroundColor Red

if ($exitosos -gt 0) {
    Write-Host "`n🎉 ¡AL MENOS UN MODELO FUNCIONA!" -ForegroundColor Green
    Write-Host "💡 Puedes usar los modelos que funcionan para tus pruebas" -ForegroundColor Cyan
} else {
    Write-Host "`n🚨 NINGÚN MODELO FUNCIONA" -ForegroundColor Red
    Write-Host "💡 Verifica tu API key o conexión a internet" -ForegroundColor Yellow
}

# Recomendaciones
Write-Host "`n💡 RECOMENDACIONES:" -ForegroundColor Yellow
Write-Host "   • Usa gemini-2.0-flash-exp para máxima velocidad" -ForegroundColor White
Write-Host "   • Usa gemini-1.5-pro para máxima capacidad" -ForegroundColor White
Write-Host "   • Actualiza tus scripts con estos nombres de modelo" -ForegroundColor White

Write-Host "`n🔧 CONFIGURACIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
