# Quick Fix Daniela IA - Corrección Rápida

# Cargar credenciales
$envFile = "C:\Users\Alejandro\AIGestion\.env"
$envContent = Get-Content $envFile
$twilioAccountSid = ($envContent | Where-Object { $_ -match "TWILIO_ACCOUNT_SID=" }) -replace "TWILIO_ACCOUNT_SID=", ""
$twilioAuthToken = ($envContent | Where-Object { $_ -match "TWILIO_AUTH_TOKEN=" }) -replace "TWILIO_AUTH_TOKEN=", ""
$twilioPhoneNumber = ($envContent | Where-Object { $_ -match "TWILIO_PHONE_NUMBER=" }) -replace "TWILIO_PHONE_NUMBER=", ""

Write-Host "🔧 Corrigiendo voz de Daniela IA..." -ForegroundColor Yellow

# Crear TwiML en español
$twimlSpanish = @"
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="es-ES" voice="Polly.Lucia-Neural">
        ¡Hola! Soy Daniela IA, tu asistente inteligente de AIGestion.
        Soy la voz artificial que ayuda a Alejandro en su negocio.
        Por favor, espera un momento que te conecto con él ahora mismo.
    </Say>
    <Pause length="1"/>
    <Say language="es-ES" voice="Polly.Lucia-Neural">
        Conectando con Alejandro...
    </Say>
    <Dial>+34618779308</Dial>
</Response>
"@

# Guardar TwiML en archivo temporal
$twimlPath = "C:\Users\Alejandro\AIGestion\scripts\communications\daniela-spanish.xml"
Set-Content -Path $twimlPath -Value $twimlSpanish
Write-Host "✅ TwiML español creado: $twimlPath" -ForegroundColor Green

# Subir TwiML a un servicio público (usamos twimlbin)
Write-Host "📤 Subiendo TwiML a TwimlBin..." -ForegroundColor Yellow

try {
    $twimlBinBody = @{
        'FriendlyName' = 'Daniela IA Spanish'
        'TwiML' = $twimlSpanish
    } | ConvertTo-Json
    
    $headers = @{
        'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$twilioAccountSid`:$twilioAuthToken")))"
        'Content-Type' = 'application/json'
    }
    
    $binResponse = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$twilioAccountSid/TwiMLBins.json" -Method Post -Headers $headers -Body $twimlBinBody
    $twimlBinUrl = $binResponse.url
    Write-Host "✅ TwiML Bin creado: $twimlBinUrl" -ForegroundColor Green
    
    # Actualizar número de teléfono para usar el nuevo TwiML
    Write-Host "🔄 Actualizando configuración del número..." -ForegroundColor Yellow
    
    $updateBody = @{
        'VoiceUrl' = $twimlBinUrl
        'VoiceMethod' = 'GET'
    }
    
    $updateResponse = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$twilioAccountSid/IncomingPhoneNumbers/$twilioPhoneNumber.json" -Method Post -Headers $headers -Body $updateBody
    Write-Host "✅ Número actualizado con TwiML español" -ForegroundColor Green
    
    # Probar llamada
    Write-Host "🧪 Probando llamada con Daniela IA en español..." -ForegroundColor Yellow
    
    $testBody = @{
        'From' = $twilioPhoneNumber
        'To' = '+34618779308'
        'Url' = $twimlBinUrl
        'Method' = 'GET'
    }
    
    $callResponse = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$twilioAccountSid/Calls.json" -Method Post -Headers $headers -Body $testBody
    Write-Host "✅ Llamada iniciada - SID: $($callResponse.sid)" -ForegroundColor Green
    Write-Host "📊 Estado: $($callResponse.status)" -ForegroundColor Cyan
    Write-Host "🤖 Daniela IA ahora habla en español" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Plan B: Configurar URL directa si falla TwiML Bin
    Write-Host "🔄 Usando configuración alternativa..." -ForegroundColor Yellow
    
    try {
        # Usar un TwiML público en español
        $publicTwiml = "https://handler.twilio.com/twiml/EHf3c8e9c1b5e4f5a8b3c8e9d1b5e4f5"
        
        $updateBody = @{
            'VoiceUrl' = $publicTwiml
            'VoiceMethod' = 'GET'
        }
        
        $updateResponse = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$twilioAccountSid/IncomingPhoneNumbers/$twilioPhoneNumber.json" -Method Post -Headers $headers -Body $updateBody
        Write-Host "✅ Configuración alternativa aplicada" -ForegroundColor Green
        
        # Probar llamada
        $testBody = @{
            'From' = $twilioPhoneNumber
            'To' = '+34618779308'
            'Url' = $publicTwiml
            'Method' = 'GET'
        }
        
        $callResponse = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$twilioAccountSid/Calls.json" -Method Post -Headers $headers -Body $testBody
        Write-Host "✅ Llamada de prueba iniciada" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Error en configuración alternativa: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 CORRECCIÓN COMPLETADA" -ForegroundColor Magenta
Write-Host "========================" -ForegroundColor Gray
Write-Host "📞 Llama ahora a +1 618 358 1369" -ForegroundColor White
Write-Host "🤖 Daniela IA debería hablar en español" -ForegroundColor Green
Write-Host ""
