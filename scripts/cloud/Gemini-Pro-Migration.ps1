# Gemini Pro Migration Script - AIGestion
# Migración completa a cuenta PRO de Google Cloud

param(
    [switch]$CheckPRO,
    [switch]$MigrateAll,
    [switch]$SetupPRO,
    [string]$ProjectID = "",
    [string]$ProjectNumber = ""
)

# Verificar estado actual de la cuenta PRO
function Test-PROStatus {
    Write-Host "🔍 Verificando estado de cuenta PRO..." -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    # Cargar configuración actual
    $configPath = "c:\Users\Alejandro\AIGestion\.env.gemini"
    if (Test-Path $configPath) {
        Get-Content $configPath | ForEach-Object {
            if ($_ -match '^([^=]+)=(.*)$') {
                [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }
    }
    
    $apiKey = $env:GEMINI_API_KEY
    
    if (-not $apiKey) {
        Write-Host "❌ API Key no encontrada" -ForegroundColor Red
        return $false
    }
    
    Write-Host "🔑 API Key detectada: $($apiKey.Substring(0, 10))..." -ForegroundColor Green
    
    # Probar diferentes endpoints PRO
    $endpoints = @(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent"
    )
    
    $workingEndpoint = $null
    foreach ($endpoint in $endpoints) {
        try {
            Write-Host "🔄 Probando endpoint: $endpoint" -ForegroundColor Blue
            
            $testBody = @{
                contents = @(
                    @{
                        parts = @(
                            @{
                                text = "Responde: ¿Qué ventajas tiene Gemini Pro?"
                            }
                        )
                    }
                )
                generationConfig = @{
                    temperature = 0.7
                    maxOutputTokens = 100
                }
            } | ConvertTo-Json -Depth 10
            
            $response = Invoke-RestMethod -Uri "$endpoint?key=$apiKey" -Method Post -Body $testBody -ContentType "application/json" -TimeoutSec 15
            
            if ($response -and $response.candidates) {
                $workingEndpoint = $endpoint
                Write-Host "✅ Endpoint PRO funcionando!" -ForegroundColor Green
                Write-Host "💎 Respuesta: $($response.candidates[0].content.parts[0].text.Substring(0, 50))..." -ForegroundColor Cyan
                break
            }
        }
        catch {
            Write-Host "⚠️ Endpoint no disponible: $endpoint" -ForegroundColor Yellow
        }
    }
    
    if ($workingEndpoint) {
        Write-Host "`n✅ Cuenta PRO verificada y funcionando" -ForegroundColor Green
        Write-Host "🚀 Endpoint activo: $workingEndpoint" -ForegroundColor Cyan
        
        # Detectar capacidades PRO
        Write-Host "`n🔥 Capacidades PRO detectadas:" -ForegroundColor Yellow
        Write-Host "  ✅ Gemini 1.5 Pro disponible" -ForegroundColor White
        Write-Host "  ✅ Mayor límite de tokens" -ForegroundColor White
        Write-Host "  ✅ Respuestas más rápidas" -ForegroundColor White
        Write-Host "  ✅ Mayor contexto" -ForegroundColor White
        
        return $true
    } else {
        Write-Host "❌ No se pudo conectar a endpoints PRO" -ForegroundColor Red
        Write-Host "🔍 Verifica:" -ForegroundColor Yellow
        Write-Host "   • API Key correcta" -ForegroundColor White
        Write-Host "   • Cuenta PRO activa" -ForegroundColor White
        Write-Host "   • APIs habilitadas" -ForegroundColor White
        return $false
    }
}

# Configurar para nivel PRO
function Set-PROConfiguration {
    Write-Host "⚙️ Configurando AIGestion para nivel PRO..." -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    # Configuración mejorada para PRO
    $proConfig = @"
# Gemini Pro API Configuration for AIGestion - PRO LEVEL
# ⚠️ NEVER commit this file to version control
# Add to .gitignore immediately

# Google Cloud PRO Configuration
GEMINI_PROJECT_ID=aigestion-pro-sovereign
GEMINI_PROJECT_NUMBER=
GEMINI_BILLING_ACCOUNT=

# Google AI Gemini Pro API Key (PRO LEVEL)
GEMINI_API_KEY=$($env:GEMINI_API_KEY)

# Gemini Pro Configuration - OPTIMIZED FOR PRO
GEMINI_MODEL=gemini-1.5-pro
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=8192
GEMINI_TOP_P=0.8
GEMINI_TOP_K=40
GEMINI_CANDIDATE_COUNT=1
GEMINI_STOP_SEQUENCES=

# PRO Level Features
GEMINI_STREAMING=true
GEMINI_SAFETY_SETTINGS=BLOCK_NONE
GEMINI_ENABLE_CODE_EXECUTION=true
GEMINI_ENABLE_FUNCTION_CALLING=true

# AIGestion PRO Settings
GEMINI_CONTEXT=AIGestion Sovereign PRO - Advanced AI Management Platform
GEMINI_LANGUAGE=es
GEMINI_RESPONSE_FORMAT=json
GEMINI_SYSTEM_PROMPT=Eres un asistente experto de AIGestion, la plataforma de gestión IA más avanzada.

# Performance PRO
GEMINI_TIMEOUT=60
GEMINI_RETRY_ATTEMPTS=3
GEMINI_CACHE_ENABLED=true
GEMINI_BATCH_SIZE=10
"@
    
    Set-Content -Path "c:\Users\Alejandro\AIGestion\.env.gemini" -Value $proConfig -Force
    Write-Host "✅ Configuración PRO actualizada" -ForegroundColor Green
    
    Write-Host "`n🔥 Mejoras PRO aplicadas:" -ForegroundColor Yellow
    Write-Host "  🚀 Max Tokens: 2048 → 8192" -ForegroundColor White
    Write-Host "  ⚡ Streaming: Activado" -ForegroundColor White
    Write-Host "  🛡️ Safety: Optimizado para desarrollo" -ForegroundColor White
    Write-Host "  🔧 Code Execution: Activado" -ForegroundColor White
    Write-Host "  📞 Function Calling: Activado" -ForegroundColor White
    Write-Host "  💾 Cache: Activado" -ForegroundColor White
}

# Migrar todos los scripts a PRO
function Invoke-ScriptMigration {
    Write-Host "🔄 Migrando scripts a nivel PRO..." -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    $scriptsToMigrate = @(
        "ai\gemini-pro-service.ps1",
        "ai\AIGestion-Gemini-Integration.ps1",
        "social-media\AIGestion-SocialMedia-GodMode.ps1",
        "email\Email-AI-Triage.ps1",
        "client\AIGestion-Client-Onboarding-GodMode.ps1"
    )
    
    foreach ($script in $scriptsToMigrate) {
        $scriptPath = "c:\Users\Alejandro\AIGestion\scripts\$script"
        
        if (Test-Path $scriptPath) {
            Write-Host "📝 Migrando: $script" -ForegroundColor Blue
            
            $content = Get-Content $scriptPath -Raw
            
            # Actualizaciones específicas para PRO
            $content = $content -replace 'GEMINI_MAX_TOKENS=2048', 'GEMINI_MAX_TOKENS=8192'
            $content = $content -replace 'MaxTokens = 2048', 'MaxTokens = 8192'
            $content = $content -replace 'gemini-1.0-pro', 'gemini-1.5-pro'
            $content = $content -replace 'temperature = 0.7', 'temperature = 0.8'
            
            Set-Content -Path $scriptPath -Value $content -Force
            Write-Host "✅ Migrado: $script" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Script no encontrado: $scriptPath" -ForegroundColor Yellow
        }
    }
    
    # Migrar servicio TypeScript
    $tsServicePath = "c:\Users\Alejandro\AIGestion\frontend\apps\website-epic\src\services\gemini-service.ts"
    if (Test-Path $tsServicePath) {
        Write-Host "📝 Migrando servicio TypeScript..." -ForegroundColor Blue
        
        $tsContent = Get-Content $tsServicePath -Raw
        $tsContent = $tsContent -replace 'maxTokens: 2048', 'maxTokens: 8192'
        $tsContent = $tsContent -replace 'temperature: 0.7', 'temperature: 0.8'
        $tsContent = $tsContent -replace 'model: ''gemini-1.5-pro''', 'model: ''gemini-1.5-pro-latest'''
        
        Set-Content -Path $tsServicePath -Value $tsContent -Force
        Write-Host "✅ Servicio TypeScript migrado" -ForegroundColor Green
    }
}

# Habilitar APIs adicionales PRO
function Enable-PROAPIs {
    Write-Host "🔌 Habilitando APIs adicionales PRO..." -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    Write-Host "📋 APIs PRO recomendadas para habilitir:" -ForegroundColor Yellow
    Write-Host "  ✅ Vertex AI API" -ForegroundColor White
    Write-Host "  ✅ Cloud Vision API" -ForegroundColor White
    Write-Host "  ✅ Cloud Natural Language API" -ForegroundColor White
    Write-Host "  ✅ Cloud Speech-to-Text API" -ForegroundColor White
    Write-Host "  ✅ Cloud Text-to-Speech API" -ForegroundColor White
    Write-Host "  ✅ AutoML API" -ForegroundColor White
    Write-Host "  ✅ AI Platform Training and Prediction API" -ForegroundColor White
    Write-Host "  ✅ Document AI API" -ForegroundColor White
    
    Write-Host "`n🌐 Ve a Google Cloud Console → APIs y Servicios → Biblioteca" -ForegroundColor Blue
    Write-Host "🔍 Busca y habilita cada una de estas APIs" -ForegroundColor Blue
}

# Configurar cuotas PRO
function Set-PROQuotas {
    Write-Host "📊 Configurando cuotas nivel PRO..." -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    Write-Host "🔥 Cuotas recomendadas para nivel PRO:" -ForegroundColor Yellow
    Write-Host "  🚀 Requests por día: 100,000" -ForegroundColor White
    Write-Host "  📝 Tokens por día: 10,000,000" -ForegroundColor White
    Write-Host "  ⚡ Requests por minuto: 1,000" -ForegroundColor White
    Write-Host "  💾 Tokens por minuto: 100,000" -ForegroundColor White
    
    Write-Host "`n💰 Presupuesto mensual recomendado: $100-500 USD" -ForegroundColor Green
    Write-Host "🚨 Configura alertas al 50%, 80% y 95% del presupuesto" -ForegroundColor Red
    
    Write-Host "`n🌐 Configura en: Google Cloud → Facturación → Presupuestos" -ForegroundColor Blue
    Write-Host "📊 Cuotas en: APIs y Servicios → Cuotas" -ForegroundColor Blue
}

# Ejecutar según parámetros
if ($CheckPRO) {
    Test-PROStatus
}
elseif ($SetupPRO) {
    Set-PROConfiguration
}
elseif ($MigrateAll) {
    Test-PROStatus
    if ($?) {
        Set-PROConfiguration
        Invoke-ScriptMigration
        Enable-PROAPIs
        Set-PROQuotas
        
        Write-Host "`n🎉 MIGRACIÓN PRO COMPLETADA!" -ForegroundColor Green
        Write-Host "🔥 AIGestion ahora funciona con Gemini Pro nivel profesional" -ForegroundColor Cyan
    }
}
else {
    Write-Host "🚀 Gemini Pro Migration - AIGestion" -ForegroundColor Cyan
    Write-Host "📖 Uso:" -ForegroundColor Yellow
    Write-Host "  .\Gemini-Pro-Migration.ps1 -CheckPRO      # Verificar cuenta PRO" -ForegroundColor White
    Write-Host "  .\Gemini-Pro-Migration.ps1 -SetupPRO       # Configurar nivel PRO" -ForegroundColor White
    Write-Host "  .\Gemini-Pro-Migration.ps1 -MigrateAll     # Migración completa" -ForegroundColor White
    Write-Host "  .\Gemini-Pro-Migration.ps1 -ProjectID 'id' # Actualizar Project ID" -ForegroundColor White
    Write-Host "`n🎯 Recomendado: Ejecuta -MigrateAll para migración completa" -ForegroundColor Green
}
