#!/usr/bin/env pwsh

# =============================================================================
# OPENAI SETUP TEST - AIGESTION
# =============================================================================

Write-Host "OPENAI SETUP TEST - AIGESTION" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

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

# Verificar API key de OpenAI
$apiKey = $env:OPENAI_API_KEY
if ($apiKey -and $apiKey -ne "sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890") {
    $maskedKey = $apiKey.Substring(0, 10) + "..." + $apiKey.Substring($apiKey.Length - 5)
    Write-Host "API Key OpenAI: $maskedKey" -ForegroundColor Green
} else {
    Write-Host "API Key OpenAI no configurada (usando placeholder)" -ForegroundColor Yellow
    Write-Host "Debes configurar tu API key real de OpenAI" -ForegroundColor Yellow
    Write-Host "1. Ve a https://platform.openai.com/api-keys" -ForegroundColor White
    Write-Host "2. Crea una nueva API key" -ForegroundColor White
    Write-Host "3. Reemplaza el placeholder en .env" -ForegroundColor White
}

# Función para probar OpenAI
function Test-OpenAIModel {
    param(
        [string]$ModelName,
        [string]$Model
    )
    
    Write-Host "`nProbando: $ModelName" -ForegroundColor Yellow
    Write-Host "Modelo: $Model" -ForegroundColor Gray
    
    $body = @{
        model = $Model
        messages = @(
            @{
                role = "user"
                content = "Responde brevemente: 'AIGestion API funciona correctamente' en español."
            }
        )
        max_tokens = 50
        temperature = 0.7
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -Headers @{
                "Authorization" = "Bearer $apiKey"
            } `
            -TimeoutSec 30 `
            -ErrorAction Stop
        
        $text = $response.choices[0].message.content
        Write-Host "EXITO: $text" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Message -match "401") {
            Write-Host "   API key inválida o expirada" -ForegroundColor Yellow
        } elseif ($_.Exception.Message -match "429") {
            Write-Host "   Rate limit excedido" -ForegroundColor Yellow
        } elseif ($_.Exception.Message -match "model_not_found") {
            Write-Host "   Modelo no disponible" -ForegroundColor Yellow
        }
        
        return $false
    }
}

# Probar modelos OpenAI
$modelos = @(
    @{ Name = "GPT-4 Turbo"; Model = "gpt-4-turbo" },
    @{ Name = "GPT-3.5 Turbo"; Model = "gpt-3.5-turbo" },
    @{ Name = "GPT-4"; Model = "gpt-4" }
)

Write-Host "`nModelos OpenAI a probar:" -ForegroundColor Yellow
$modelos | ForEach-Object { Write-Host "  -> $($_.Name)" -ForegroundColor White }

# Probar cada modelo
$resultados = @()
foreach ($modelo in $modelos) {
    if ($apiKey -and $apiKey -ne "sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890") {
        $resultado = Test-OpenAIModel -ModelName $modelo.Name -Model $modelo.Model
        $resultados += @{
            Name = $modelo.Name
            Model = $modelo.Model
            Success = $resultado
        }
        Start-Sleep -Seconds 1
    } else {
        Write-Host "Omitiendo prueba de $($modelo.Name) - API key no configurada" -ForegroundColor Yellow
        $resultados += @{
            Name = $modelo.Name
            Model = $modelo.Model
            Success = $false
        }
    }
}

# Resumen
Write-Host "`nRESUMEN DE OPENAI" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

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

# Configuración recomendada
Write-Host "`nCONFIGURACIÓN RECOMENDADA:" -ForegroundColor Yellow
Write-Host "1. Obtener API key real de OpenAI" -ForegroundColor White
Write-Host "2. Actualizar OPENAI_API_KEY en .env" -ForegroundColor White
Write-Host "3. Usar gpt-4-turbo para máxima calidad" -ForegroundColor White
Write-Host "4. Usar gpt-3.5-turbo para mayor velocidad" -ForegroundColor White

if ($exitosos -gt 0) {
    Write-Host "`n✅ OPENAI CONFIGURADO CORRECTAMENTE" -ForegroundColor Green
} else {
    Write-Host "`n❌ OPENAI REQUIERE CONFIGURACIÓN" -ForegroundColor Red
}

Write-Host "`nTEST COMPLETADO" -ForegroundColor Cyan
