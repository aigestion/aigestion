#!/usr/bin/env pwsh

# =============================================================================
# CHECK AVAILABLE GEMINI MODELS
# =============================================================================

Write-Host "CHECK AVAILABLE GEMINI MODELS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Cargar API key
$envFile = "c:\Users\Alejandro\AIGestion\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

$apiKey = $env:GOOGLE_AI_API_KEY
if ($apiKey) {
    $maskedKey = $apiKey.Substring(0, 10) + "..." + $apiKey.Substring($apiKey.Length - 5)
    Write-Host "API Key: $maskedKey" -ForegroundColor Yellow
} else {
    Write-Host "API Key no encontrada" -ForegroundColor Red
    exit 1
}

# Listar modelos disponibles
Write-Host "Listando modelos disponibles..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey" `
        -Method Get `
        -TimeoutSec 30 `
        -ErrorAction Stop
    
    Write-Host "Modelos disponibles:" -ForegroundColor Green
    
    # Filtrar solo modelos Gemini
    $geminiModels = $response.models | Where-Object { $_.name -match "gemini" }
    
    foreach ($model in $geminiModels) {
        $modelName = $model.name -replace "models/", ""
        $displayName = $model.displayName
        $supportedMethods = $model.supportedGenerationMethods -join ", "
        
        Write-Host "  -> $modelName" -ForegroundColor White
        Write-Host "     Nombre: $displayName" -ForegroundColor Gray
        Write-Host "     Metodos: $supportedMethods" -ForegroundColor Gray
        Write-Host ""
    }
    
    # Mostrar modelos que soportan generateContent
    $generateContentModels = $geminiModels | Where-Object { $_.supportedGenerationMethods -contains "generateContent" }
    
    Write-Host "Modelos que soportan generateContent (para nuestro uso):" -ForegroundColor Cyan
    foreach ($model in $generateContentModels) {
        $modelName = $model.name -replace "models/", ""
        Write-Host "  ✅ $modelName" -ForegroundColor Green
    }
    
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "CHECK COMPLETADO" -ForegroundColor Cyan
