#!/usr/bin/env pwsh

# =============================================================================
# GEMINI MODELS TEST - CORRECT MODELS
# =============================================================================

Write-Host "GEMINI MODELS TEST - CORRECT MODELS" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Cargar variables de entorno
$envFile = "c:\Users\Alejandro\AIGestion\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    Write-Host "Variables de entorno cargadas" -ForegroundColor Green
} else {
    Write-Host "Archivo .env no encontrado" -ForegroundColor Red
    exit 1
}

# API key
$apiKey = $env:GOOGLE_AI_API_KEY
if ($apiKey) {
    $maskedKey = $apiKey.Substring(0, 10) + "..." + $apiKey.Substring($apiKey.Length - 5)
    Write-Host "API Key: $maskedKey" -ForegroundColor Yellow
} else {
    Write-Host "API Key no encontrada" -ForegroundColor Red
    exit 1
}

# Modelos CORRECTOS a probar
$modelos = @(
    @{ Name = "Gemini 2.5 Flash (Principal)"; Model = "gemini-2.5-flash" },
    @{ Name = "Gemini 2.5 Pro"; Model = "gemini-2.5-pro" },
    @{ Name = "Gemini 2.0 Flash"; Model = "gemini-2.0-flash" },
    @{ Name = "Gemini 3.1 Pro Preview"; Model = "gemini-3.1-pro-preview" },
    @{ Name = "Gemini 3 Flash Preview"; Model = "gemini-3-flash-preview" },
    @{ Name = "Gemini Flash Latest"; Model = "gemini-flash-latest" },
    @{ Name = "Gemini Pro Latest"; Model = "gemini-pro-latest" }
)

Write-Host "Modelos CORRECTOS a probar:" -ForegroundColor Yellow
$modelos | ForEach-Object { Write-Host "  -> $($_.Name)" -ForegroundColor White }

# Función para probar modelo
function Test-GeminiModel {
    param(
        [string]$ModelName,
        [string]$Model
    )
    
    Write-Host "Probando: $ModelName" -ForegroundColor Yellow
    Write-Host "Modelo: $Model" -ForegroundColor Gray
    
    $body = @{
        contents = @(
            @{
                parts = @(
                    @{
                        text = "Responde brevemente: 'AIGestion API funciona correctamente' en español."
                    }
                )
            }
        )
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/$($Model):generateContent?key=$apiKey" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -TimeoutSec 30 `
            -ErrorAction Stop
        
        $text = $response.candidates[0].content.parts[0].text
        Write-Host "EXITO: $text" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Probar cada modelo
$resultados = @()
foreach ($modelo in $modelos) {
    $resultado = Test-GeminiModel -ModelName $modelo.Name -Model $modelo.Model
    $resultados += @{
        Name = $modelo.Name
        Model = $modelo.Model
        Success = $resultado
    }
    Start-Sleep -Seconds 1
}

# Resumen
Write-Host "RESUMEN DE RESULTADOS" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

$exitosos = 0
$resultados | ForEach-Object {
    if ($_.Success) {
        Write-Host "OK: $($_.Name)" -ForegroundColor Green
        $exitosos++
    } else {
        Write-Host "FAIL: $($_.Name)" -ForegroundColor Red
    }
}

Write-Host "Estadisticas:" -ForegroundColor Yellow
Write-Host "Total modelos: $($resultados.Count)" -ForegroundColor White
Write-Host "Funcionando: $exitosos" -ForegroundColor Green
Write-Host "Fallidos: $($resultados.Count - $exitosos)" -ForegroundColor Red

if ($exitosos -gt 0) {
    Write-Host "EXITO: Modelos funcionando correctamente!" -ForegroundColor Green
    Write-Host "Recomendaciones:" -ForegroundColor Cyan
    $resultados | Where-Object { $_.Success } | ForEach-Object {
        Write-Host "  • Usa $($_.Model) para máxima velocidad" -ForegroundColor White
    }
} else {
    Write-Host "ERROR: Ningun modelo funciona" -ForegroundColor Red
}

Write-Host "TEST COMPLETADO" -ForegroundColor Cyan
