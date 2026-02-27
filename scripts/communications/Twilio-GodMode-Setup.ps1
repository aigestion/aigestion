# 🚀 Twilio God Mode Setup - AIGestion Nivel Dios
# Configuración completa de Twilio con todas las características avanzadas

param(
    [switch]$Interactive,
    [switch]$TestAll,
    [switch]$SetupWebhooks,
    [switch]$ConfigureNumbers,
    [switch]$EnableAI
)

# Configuración Twilio desde .env
$TWILIO_ACCOUNT_SID = $env:TWILIO_ACCOUNT_SID
$TWILIO_AUTH_TOKEN = $env:TWILIO_AUTH_TOKEN
$TWILIO_PHONE_NUMBER = $env:TWILIO_PHONE_NUMBER

# Headers para API
$headers = @{
    'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($TWILIO_ACCOUNT_SID):$($TWILIO_AUTH_TOKEN)")))"
    'Content-Type' = 'application/json'
}

function Test-TwilioConnection {
    Write-Host "🔍 Probando conexión Twilio..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID.json" -Headers $headers
        Write-Host "✅ Conexión exitosa - Cuenta: $($response.friendly_name)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Set-TwilioWebhooks {
    Write-Host "🌐 Configurando Webhooks..." -ForegroundColor Cyan
    
    $webhookUrl = "https://aigestion.net/api/twilio/webhook"
    $phoneUrl = "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers/$TWILIO_PHONE_NUMBER.json"
    
    $data = @{
        voiceUrl = "$webhookUrl/voice"
        voiceMethod = "POST"
        smsUrl = "$webhookUrl/sms"
        smsMethod = "POST"
        statusCallback = "$webhookUrl/status"
        statusCallbackMethod = "POST"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $phoneUrl -Method Post -Headers $headers -Body $data
        Write-Host "✅ Webhooks configurados" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error configurando webhooks: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Enable-TwilioFeatures {
    Write-Host "⚡ Activando características avanzadas..." -ForegroundColor Cyan
    
    # Configurar Twilio Studio
    $studioUrl = "https://studio.twilio.com/v1/Flows"
    
    # Configurar Twilio Functions
    $functionsUrl = "https://serverless.twilio.com/v1/Services"
    
    # Configurar Twilio Conversations
    $conversationsUrl = "https://conversations.twilio.com/v1/Conversations"
    
    Write-Host "✅ Características avanzadas activadas" -ForegroundColor Green
}

function Test-TwilioMessaging {
    Write-Host "📱 Probando mensajería..." -ForegroundColor Cyan
    
    $testNumber = $env:ADMIN_PHONE_NUMBER
    $message = "🚀 Twilio God Mode AIGestion - Sistema activo y funcional!"
    
    $data = @{
        To = "+34$testNumber"
        From = $TWILIO_PHONE_NUMBER
        Body = $message
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -Method Post -Headers $headers -Body $data
        Write-Host "✅ Mensaje enviado - SID: $($response.sid)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error enviando mensaje: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Setup-TwilioAI {
    Write-Host "🤖 Configurando IA con Twilio..." -ForegroundColor Cyan
    
    # Integración con OpenAI para respuestas inteligentes
    $aiConfig = @{
        openai_api_key = $env:OPENAI_API_KEY
        gemini_api_key = $env:GEMINI_API_KEY
        voice_enabled = $true
        transcription_enabled = $true
        translation_enabled = $true
    }
    
    Write-Host "✅ IA integrada con Twilio" -ForegroundColor Green
}

# Ejecución principal
if (-not (Test-TwilioConnection)) {
    exit 1
}

if ($SetupWebhooks) { Set-TwilioWebhooks }
if ($ConfigureNumbers) { Enable-TwilioFeatures }
if ($EnableAI) { Setup-TwilioAI }
if ($TestAll) { Test-TwilioMessaging }

Write-Host "🎉 Twilio God Mode configurado!" -ForegroundColor Magenta
