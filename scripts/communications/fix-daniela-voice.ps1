# Fix Daniela IA Voice - Corregir configuración Twilio

# Cargar credenciales
$envFile = "C:\Users\Alejandro\AIGestion\.env"
$envContent = Get-Content $envFile
$twilioAccountSid = ($envContent | Where-Object { $_ -match "TWILIO_ACCOUNT_SID=" }) -replace "TWILIO_ACCOUNT_SID=", ""
$twilioAuthToken = ($envContent | Where-Object { $_ -match "TWILIO_AUTH_TOKEN=" }) -replace "TWILIO_AUTH_TOKEN=", ""
$twilioPhoneNumber = ($envContent | Where-Object { $_ -match "TWILIO_PHONE_NUMBER=" }) -replace "TWILIO_PHONE_NUMBER=", ""

Write-Host "🔧 Corrigiendo configuración de Daniela IA..." -ForegroundColor Yellow

# Paso 1: Verificar configuración actual
Write-Host "1/3 Verificando configuración actual..." -ForegroundColor Cyan

$headers = @{
    'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$twilioAccountSid`:$twilioAuthToken")))"
}

try {
    $currentConfig = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$twilioAccountSid/IncomingPhoneNumbers/$twilioPhoneNumber.json" -Headers $headers
    Write-Host "URL actual: $($currentConfig.voice_url)" -ForegroundColor Gray
    
    if ($currentConfig.voice_url -like "*demo.twilio.com*") {
        Write-Host "❌ PROBLEMA: Usando TwiML demo en inglés" -ForegroundColor Red
    } else {
        Write-Host "✅ Webhook configurado" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error verificando configuración: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Paso 2: Iniciar servidor webhook local
Write-Host "2/3 Iniciando servidor webhook local..." -ForegroundColor Cyan

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js versión: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Instalando..." -ForegroundColor Red
    winget install OpenJS.NodeJS -e
}

# Instalar dependencias si es necesario
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm init -y
    npm install express twilio
}

# Iniciar servidor webhook en background
$webhookScript = @"
const express = require('express');
const { VoiceResponse } = require('twilio').twiml;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/twilio/voice', (req, res) => {
    console.log('📞 Llamada de Daniela IA');
    const response = new VoiceResponse();
    
    response.say({ 
        language: 'es-ES', 
        voice: 'Polly.Lucia-Neural'
    }, `
        ¡Hola! Soy Daniela IA, tu asistente inteligente de AIGestion.
        Soy la voz artificial que ayuda a Alejandro a gestionar su negocio.
        Por favor, espera un momento que te conecto con él.
    `);
    
    response.pause({ length: 1 });
    response.say({ 
        language: 'es-ES', 
        voice: 'Polly.Lucia-Neural'
    }, 'Conectando con Alejandro ahora...');
    
    response.dial('+34618779308');
    
    res.type('text/xml');
    res.send(response.toString());
});

app.listen(3000, () => {
    console.log('🚀 Servidor Daniela IA activo en puerto 3000');
});
"@

Set-Content -Path "daniela-webhook-temp.js" -Value $webhookScript

# Iniciar en background
Start-Job -ScriptBlock {
    Set-Location "C:\Users\Alejandro\AIGestion\scripts\communications"
    node daniela-webhook-temp.js
} -Name "DanielaWebhook"

Start-Sleep -Seconds 3
Write-Host "✅ Servidor webhook iniciado en localhost:3000" -ForegroundColor Green

# Paso 3: Configurar ngrok y actualizar Twilio
Write-Host "3/3 Configurando ngrok y actualizando Twilio..." -ForegroundColor Cyan

# Verificar si ngrok está instalado
try {
    $ngrokVersion = ngrok version
    Write-Host "✅ ngrok versión: $ngrokVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ngrok no encontrado. Descargando..." -ForegroundColor Red
    Invoke-WebRequest -Uri "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip" -OutFile "ngrok.zip"
    Expand-Archive -Path "ngrok.zip" -DestinationPath "."
    Remove-Item "ngrok.zip"
}

# Iniciar ngrok
Start-Job -ScriptBlock {
    Set-Location "C:\Users\Alejandro\AIGestion\scripts\communications"
    ngrok http 3000 --log=stdout
} -Name "NgrokTunnel"

Start-Sleep -Seconds 5

# Obtener URL de ngrok
try {
    $ngrokResponse = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels"
    $publicUrl = $ngrokResponse.tunnels[0].public_url
    Write-Host "✅ ngrok URL: $publicUrl" -ForegroundColor Green
    
    $webhookUrl = "$publicUrl/api/twilio/voice"
    Write-Host "📞 Webhook URL: $webhookUrl" -ForegroundColor Yellow
    
    # Actualizar configuración de Twilio
    $updateBody = @{
        'VoiceUrl' = $webhookUrl
        'VoiceMethod' = 'POST'
        'VoiceFallbackUrl' = "$webhookUrl/fallback"
        'VoiceFallbackMethod' = 'POST'
        'StatusCallback' = "$webhookUrl/call-status"
        'StatusCallbackMethod' = 'POST'
    }
    
    $updateHeaders = @{
        'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$twilioAccountSid`:$twilioAuthToken")))"
        'Content-Type' = 'application/x-www-form-urlencoded'
    }
    
    Write-Host "🔄 Actualizando configuración de Twilio..." -ForegroundColor Yellow
    $updateResponse = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$twilioAccountSid/IncomingPhoneNumbers/$twilioPhoneNumber.json" -Method Post -Headers $updateHeaders -Body $updateBody
    
    Write-Host "✅ Configuración actualizada exitosamente" -ForegroundColor Green
    Write-Host "📞 Nueva URL: $($updateResponse.voice_url)" -ForegroundColor Cyan
    
    # Probar llamada
    Write-Host "🧪 Probando llamada con Daniela IA..." -ForegroundColor Yellow
    $testBody = @{
        'From' = $twilioPhoneNumber
        'To' = '+34618779308'
        'Url' = $webhookUrl
        'Method' = 'POST'
    }
    
    $callResponse = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$twilioAccountSid/Calls.json" -Method Post -Headers $updateHeaders -Body $testBody
    Write-Host "✅ Llamada iniciada - SID: $($callResponse.sid)" -ForegroundColor Green
    Write-Host "📊 Estado: $($callResponse.status)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error con ngrok/Twilio: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 CONFIGURACIÓN COMPLETADA" -ForegroundColor Magenta
Write-Host "========================" -ForegroundColor Gray
Write-Host "🤖 Daniela IA ahora habla en español" -ForegroundColor Green
Write-Host "📞 Llama a +1 618 358 1369 para probar" -ForegroundColor White
Write-Host "🔧 Servidor webhook: localhost:3000" -ForegroundColor Gray
Write-Host "🌐 ngrok tunnel: Activo" -ForegroundColor Gray
Write-Host ""

# Mantener procesos corriendo
Write-Host "Presiona Ctrl+C para detener los servicios" -ForegroundColor Yellow
try {
    while ($true) {
        Start-Sleep -Seconds 10
        Write-Host "✅ Daniela IA activa y esperando llamadas..." -ForegroundColor Green
    }
} catch {
    Write-Host "🛑 Deteniendo servicios..." -ForegroundColor Yellow
    Stop-Job -Name "DanielaWebhook" -ErrorAction SilentlyContinue
    Stop-Job -Name "NgrokTunnel" -ErrorAction SilentlyContinue
    Remove-Job -Name "DanielaWebhook" -ErrorAction SilentlyContinue
    Remove-Job -Name "NgrokTunnel" -ErrorAction SilentlyContinue
}
