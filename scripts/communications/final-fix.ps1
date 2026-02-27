# Final Fix - Daniela IA Spanish Voice

$sid = "REDACTED_TWILIO_SID"
$token = "REDACTED_TWILIO_TOKEN"
$phone = "+16183581369"

Write-Host "Fixing Daniela IA voice..." -ForegroundColor Yellow

$auth = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$sid`:$token"))
$headers = @{"Authorization" = $auth; "Content-Type" = "application/json"}

$twiml = '<?xml version="1.0" encoding="UTF-8"?><Response><Say language="es-ES" voice="Polly.Lucia-Neural">Hola soy Daniela IA de AIGestion. Conectando con Alejandro ahora.</Say><Dial>+34618779308</Dial></Response>'

$body = @{
    "FriendlyName" = "Daniela IA Spanish"
    "TwiML" = $twiml
} | ConvertTo-Json

try {
    Write-Host "Creating TwiML Bin..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/TwiMLBins.json" -Method Post -Headers $headers -Body $body
    Write-Host "TwiML Bin created: $($response.url)" -ForegroundColor Green
    
    Write-Host "Updating phone number..." -ForegroundColor Cyan
    $updateBody = @{
        "VoiceUrl" = $response.url
        "VoiceMethod" = "GET"
    }
    
    $update = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/IncomingPhoneNumbers/$phone.json" -Method Post -Headers $headers -Body $updateBody
    Write-Host "Phone number updated with Spanish voice" -ForegroundColor Green
    
    Write-Host "Starting test call..." -ForegroundColor Yellow
    $callBody = @{
        "From" = $phone
        "To" = "+34618779308"
        "Url" = $response.url
        "Method" = "GET"
    }
    
    $call = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/Calls.json" -Method Post -Headers $headers -Body $callBody
    Write-Host "Call initiated: $($call.sid)" -ForegroundColor Green
    Write-Host "Daniela IA now speaks Spanish" -ForegroundColor Magenta
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "READY - Call +1 618 358 1369" -ForegroundColor White
Write-Host "Daniela IA should greet you in Spanish" -ForegroundColor Green
