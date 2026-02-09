# Google Cloud Quick Setup for AIGestion Sovereign
# Script automatizado para configuración rápida

param(
    [switch]$Guide,
    [switch]$CheckConfig,
    [switch]$TestConnection,
    [string]$APIKey = "",
    [string]$ProjectID = ""
)

# Mostrar guía completa
function Show-SetupGuide {
    Write-Host "🌩️ GUÍA RÁPIDA - Google Cloud Console" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    Write-Host "`n📋 PASO 1: Crear Proyecto" -ForegroundColor Yellow
    Write-Host "1. Ve a: https://console.cloud.google.com/" -ForegroundColor White
    Write-Host "2. Selector de proyectos → NUEVO PROYECTO" -ForegroundColor White
    Write-Host "3. Nombre: 'AIGestion Sovereign'" -ForegroundColor White
    Write-Host "4. ID: 'aigestion-sovereign-2026'" -ForegroundColor White
    Write-Host "5. CREAR y esperar 2-3 minutos" -ForegroundColor White
    
    Write-Host "`n🔑 PASO 2: Habilitar API" -ForegroundColor Yellow
    Write-Host "1. API y servicios → Biblioteca" -ForegroundColor White
    Write-Host "2. Buscar: 'Generative Language API'" -ForegroundColor White
    Write-Host "3. Seleccionar y HABILITAR" -ForegroundColor White
    Write-Host "4. Esperar confirmación" -ForegroundColor White
    
    Write-Host "`n🔐 PASO 3: Crear API Key" -ForegroundColor Yellow
    Write-Host "1. API y servicios → Credenciales" -ForegroundColor White
    Write-Host "2. + CREAR CREDENCIALES → Clave de API" -ForegroundColor White
    Write-Host "3. Nombre: 'AIGestion-Gemini-Pro-Key'" -ForegroundColor White
    Write-Host "4. Restringir a: Generative Language API" -ForegroundColor White
    Write-Host "5. COPIAR la key inmediatamente" -ForegroundColor White
    
    Write-Host "`n⚙️ PASO 4: Configurar AIGestion" -ForegroundColor Yellow
    Write-Host "1. Ejecutar: .\Google-Cloud-Quick-Setup.ps1 -CheckConfig" -ForegroundColor White
    Write-Host "2. Actualizar .env.gemini con tu API key" -ForegroundColor White
    Write-Host "3. Ejecutar: .\Google-Cloud-Quick-Setup.ps1 -TestConnection" -ForegroundColor White
    
    Write-Host "`n📚 Guía completa en: docs\Google-Cloud-Setup-Guide.md" -ForegroundColor Green
    Write-Host "=" * 60 -ForegroundColor Gray
}

# Verificar configuración actual
function Check-CurrentConfig {
    Write-Host "🔍 Verificando configuración actual..." -ForegroundColor Blue
    
    $configPath = "c:\Users\Alejandro\AIGestion\.env.gemini"
    
    if (-not (Test-Path $configPath)) {
        Write-Host "❌ Archivo .env.gemini no encontrado" -ForegroundColor Red
        Write-Host "📝 Creando archivo de configuración..." -ForegroundColor Yellow
        
        $configContent = @"
# Gemini Pro API Configuration for AIGestion Sovereign
# ⚠️ NEVER commit this file to version control

# Google Cloud Configuration
GEMINI_PROJECT_ID=aigestion-sovereign-2026
GEMINI_PROJECT_NUMBER=  # Reemplazar con tu número de proyecto

# Google AI Gemini Pro API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Gemini Pro Configuration
GEMINI_MODEL=gemini-1.5-pro
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=2048
GEMINI_TOP_P=0.8
GEMINI_TOP_K=40

# AIGestion Sovereign Settings
GEMINI_CONTEXT=AIGestion Sovereign AI Assistant
GEMINI_LANGUAGE=es
GEMINI_RESPONSE_FORMAT=json
"@
        
        Set-Content -Path $configPath -Value $configContent -Force
        Write-Host "✅ Archivo .env.gemini creado" -ForegroundColor Green
    }
    
    # Cargar configuración
    Get-Content $configPath | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    
    # Verificar valores
    Write-Host "`n📋 Configuración actual:" -ForegroundColor Cyan
    Write-Host "🆔 Project ID: $env:GEMINI_PROJECT_ID" -ForegroundColor White
    Write-Host "🔢 Project Number: $env:GEMINI_PROJECT_NUMBER" -ForegroundColor White
    Write-Host "🔑 API Key: $(if($env:GEMINI_API_KEY -eq 'your_gemini_api_key_here') {'❌ No configurada'} else {'✅ Configurada'})" -ForegroundColor White
    Write-Host "🤖 Model: $env:GEMINI_MODEL" -ForegroundColor White
    Write-Host "🌡️ Temperature: $env:GEMINI_TEMPERATURE" -ForegroundColor White
    
    # Verificar si falta configuración
    $missing = @()
    if (-not $env:GEMINI_PROJECT_ID -or $env:GEMINI_PROJECT_ID -eq 'aigestion-sovereign-2026') { $missing += "Project ID" }
    if (-not $env:GEMINI_PROJECT_NUMBER) { $missing += "Project Number" }
    if (-not $env:GEMINI_API_KEY -or $env:GEMINI_API_KEY -eq 'your_gemini_api_key_here') { $missing += "API Key" }
    
    if ($missing.Count -gt 0) {
        Write-Host "`n⚠️ Configuración incompleta:" -ForegroundColor Yellow
        $missing | ForEach-Object { Write-Host "   ❌ $_" -ForegroundColor Red }
        Write-Host "`n📝 Sigue la guía para completar la configuración" -ForegroundColor Yellow
    }
    else {
        Write-Host "`n✅ Configuración completa" -ForegroundColor Green
    }
}

# Probar conexión con Gemini Pro
function Test-GeminiConnection {
    Write-Host "🧪 Probando conexión con Gemini Pro..." -ForegroundColor Blue
    
    # Cargar configuración
    $configPath = "c:\Users\Alejandro\AIGestion\.env.gemini"
    if (-not (Test-Path $configPath)) {
        Write-Host "❌ Archivo de configuración no encontrado" -ForegroundColor Red
        return
    }
    
    Get-Content $configPath | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    
    $apiKey = $env:GEMINI_API_KEY
    $projectId = $env:GEMINI_PROJECT_ID
    
    if (-not $apiKey -or $apiKey -eq 'your_gemini_api_key_here') {
        Write-Host "❌ API Key no configurada" -ForegroundColor Red
        Write-Host "📝 Por favor edita .env.gemini y añade tu API key" -ForegroundColor Yellow
        return
    }
    
    if (-not $projectId -or $projectId -eq 'aigestion-sovereign-2026') {
        Write-Host "⚠️ Project ID no actualizado" -ForegroundColor Yellow
        Write-Host "📝 Verifica tu Project ID en Google Cloud Console" -ForegroundColor Yellow
    }
    
    # Probar API
    $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=$apiKey"
    
    $testBody = @{
        contents = @(
            @{
                parts = @(
                    @{
                        text = "Responde en español: ¿Qué es AIGestion Sovereign en una frase?"
                    }
                )
            }
        )
        generationConfig = @{
            temperature = 0.7
            maxOutputTokens = 100
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        Write-Host "🔄 Enviando solicitud a Gemini Pro..." -ForegroundColor Blue
        $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $testBody -ContentType "application/json" -TimeoutSec 30
        
        if ($response -and $response.candidates -and $response.candidates.Count -gt 0) {
            $result = $response.candidates[0].content.parts[0].text
            Write-Host "`n✅ Conexión exitosa!" -ForegroundColor Green
            Write-Host "💎 Respuesta de Gemini Pro:" -ForegroundColor Cyan
            Write-Host $result -ForegroundColor White
            
            # Mostrar info del proyecto
            Write-Host "`n📊 Información del proyecto:" -ForegroundColor Cyan
            Write-Host "🆔 Project ID: $projectId" -ForegroundColor White
            Write-Host "🤖 Modelo: gemini-1.5-pro" -ForegroundColor White
            Write-Host "🔑 API Key: ✅ Funcionando" -ForegroundColor Green
            
            return $true
        } else {
            Write-Host "❌ Respuesta inesperada de la API" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Error en conexión: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Message -match "403") {
            Write-Host "🔍 Posibles causas:" -ForegroundColor Yellow
            Write-Host "   • API key inválida o incorrecta" -ForegroundColor White
            Write-Host "   • API no habilitada en el proyecto" -ForegroundColor White
            Write-Host "   • Restricciones de IP o aplicación" -ForegroundColor White
        }
        elseif ($_.Exception.Message -match "429") {
            Write-Host "🔍 Posibles causas:" -ForegroundColor Yellow
            Write-Host "   • Cuota de API excedida" -ForegroundColor White
            Write-Host "   • Demasiadas solicitudes" -ForegroundColor White
        }
        
        return $false
    }
}

# Actualizar configuración con nuevos valores
function Update-Configuration {
    param(
        [string]$NewAPIKey,
        [string]$NewProjectID
    )
    
    $configPath = "c:\Users\Alejandro\AIGestion\.env.gemini"
    
    if (-not (Test-Path $configPath)) {
        Write-Host "❌ Archivo de configuración no encontrado" -ForegroundColor Red
        return
    }
    
    $content = Get-Content $configPath
    
    if ($NewAPIKey) {
        $content = $content -replace 'GEMINI_API_KEY=.*', "GEMINI_API_KEY=$NewAPIKey"
        Write-Host "✅ API Key actualizada" -ForegroundColor Green
    }
    
    if ($NewProjectID) {
        $content = $content -replace 'GEMINI_PROJECT_ID=.*', "GEMINI_PROJECT_ID=$NewProjectID"
        Write-Host "✅ Project ID actualizado" -ForegroundColor Green
    }
    
    Set-Content -Path $configPath -Value $content -Force
    Write-Host "💾 Configuración guardada en .env.gemini" -ForegroundColor Green
}

# Ejecutar según parámetros
if ($Guide) {
    Show-SetupGuide
}
elseif ($CheckConfig) {
    Check-CurrentConfig
}
elseif ($TestConnection) {
    Test-GeminiConnection
}
elseif ($APIKey -or $ProjectID) {
    Update-Configuration -NewAPIKey $APIKey -NewProjectID $ProjectID
}
else {
    Write-Host "🌩️ Google Cloud Quick Setup - AIGestion Sovereign" -ForegroundColor Cyan
    Write-Host "📖 Uso:" -ForegroundColor Yellow
    Write-Host "  .\Google-Cloud-Quick-Setup.ps1 -Guide          # Mostrar guía completa" -ForegroundColor White
    Write-Host "  .\Google-Cloud-Quick-Setup.ps1 -CheckConfig    # Verificar configuración" -ForegroundColor White
    Write-Host "  .\Google-Cloud-Quick-Setup.ps1 -TestConnection # Probar conexión" -ForegroundColor White
    Write-Host "  .\Google-Cloud-Quick-Setup.ps1 -APIKey 'key'   # Actualizar API key" -ForegroundColor White
    Write-Host "  .\Google-Cloud-Quick-Setup.ps1 -ProjectID 'id' # Actualizar Project ID" -ForegroundColor White
    Write-Host "`n🚀 Recomendado: Ejecuta -Guide primero" -ForegroundColor Green
}
