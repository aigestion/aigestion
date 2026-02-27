# Instant Fix for Daniela IA Voice

$sid = "REDACTED_TWILIO_SID"
$token = $env:TWILIO_AUTH_TOKEN
$phone = "+16183581369"

Write-Host "🔧 Arreglando voz de Daniela IA..." -ForegroundColor Yellow

$auth = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$sid`:$token"))
$headers = @{"Authorization" = $auth; "Content-Type" = "application/json"}

# TwiML en español simple
$twiml = '<?xml version="1.0" encoding="UTF-8"?><Response><Say language="es-ES" voice="Polly.Lucia-Neural">Hola soy Daniela IA de AIGestion. Conectando con Alejandro ahora.</Say><Dial>+34618779308</Dial></Response>'

$body = @{
    "FriendlyName" = "Daniela IA Spanish"
    "TwiML" = $twiml
} | ConvertTo-Json

try {
    Write-Host "Creando TwiML Bin..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/TwiMLBins.json" -Method Post -Headers $headers -Body $body
    Write-Host "✅ TwiML Bin creado: $($response.url)" -ForegroundColor Green
    
    Write-Host "Actualizando número..." -ForegroundColor Cyan
    $updateBody = @{
        "VoiceUrl" = $response.url
        "VoiceMethod" = "GET"
    }
    
    $update = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/IncomingPhoneNumbers/$phone.json" -Method Post -Headers $headers -Body $updateBody
    Write-Host "✅ Número actualizado con voz en español" -ForegroundColor Green
    
    Write-Host "Iniciando llamada de prueba..." -ForegroundColor Yellow
    $callBody = @{
        "From" = $phone
        "To" = "+34618779308"
        "Url" = $response.url
        "Method" = "GET"
    }
    
    $call = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/Calls.json" -Method Post -Headers $headers -Body $callBody
    Write-Host "✅ Llamada iniciada: $($call.sid)" -ForegroundColor Green
    Write-Host "🤖 Daniela IA ahora habla español" -ForegroundColor Magenta
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 LISTO - Llama a +1 618 358 1369" -ForegroundColor White
Write-Host "🤖 Daniela IA debería saludarte en español" -ForegroundColor Green
