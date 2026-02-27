# Llamar ahora - Daniela IA

$sid = "REDACTED_TWILIO_SID"
$token = $env:TWILIO_AUTH_TOKEN
$phone = "+16183581369"

Write-Host "Daniela IA llamando..." -ForegroundColor Yellow

$auth = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$sid`:$token"))

$headers = @{
    "Authorization" = $auth
    "Content-Type" = "application/x-www-form-urlencoded"
}

$body = @{
    "From" = $phone
    "To" = "+34618779308"
    "Url" = "https://handler.twilio.com/twiml/EHf3c8e9c1b5e4f5a8b3c8e9d1b5e4f5"
    "Method" = "GET"
}

try {
    $call = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$sid/Calls.json" -Method Post -Headers $headers -Body $body
    Write-Host "Llamada iniciada: " $call.sid -ForegroundColor Green
    Write-Host "Daniela IA esta llamando ahora" -ForegroundColor Magenta
} catch {
    Write-Host "Error: " $_.Exception.Message -ForegroundColor Red
}
