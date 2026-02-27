# Test Call - Daniela IA Spanish

$sid = "REDACTED_TWILIO_SID"
$token = "REDACTED_TWILIO_TOKEN"
$phone = "+16183581369"

$auth = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$sid`:$token"))

$headers = @{
    "Authorization" = $auth
    "Content-Type" = "application/x-www-form-urlencoded"
}

$twiml = "https://handler.twilio.com/twiml/EHf3c8e9c1b5e4f5a8b3c8e9d1b5e4f5"

$body = @{
    "From" = $phone
    "To" = "+34618779308"
    "Url" = $twiml
    "Method" = "GET"
}

Write-Host "Iniciando llamada con Daniela IA en espanol..." -ForegroundColor Yellow

try {
    $call = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/Calls.json" -Method Post -Headers $headers -Body $body
    Write-Host "Llamada iniciada: " $call.sid -ForegroundColor Green
    Write-Host "Daniela IA deberia saludarte en espanol" -ForegroundColor Magenta
} catch {
    Write-Host "Error: " $_.Exception.Message -ForegroundColor Red
}
