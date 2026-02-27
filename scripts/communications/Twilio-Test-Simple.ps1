# 🧪 Twilio Test Simple - AIGestion

# Configuración
$TWILIO_ACCOUNT_SID = $env:TWILIO_ACCOUNT_SID
$TWILIO_AUTH_TOKEN = $env:TWILIO_AUTH_TOKEN
$TWILIO_PHONE_NUMBER = "+16183581369"

Write-Host "🚀 Probando Twilio..." -ForegroundColor Cyan
Write-Host "Account SID: $TWILIO_ACCOUNT_SID" -ForegroundColor Yellow

# Crear headers
$credentials = "$TWILIO_ACCOUNT_SID`:$TWILIO_AUTH_TOKEN"
$encodedCreds = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($credentials))
$headers = @{
    'Authorization' = "Basic $encodedCreds"
    'Content-Type' = 'application/json'
}

try {
    $url = "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID.json"
    $response = Invoke-RestMethod -Uri $url -Headers $headers
    Write-Host "✅ Conexion OK!" -ForegroundColor Green
    Write-Host "Cuenta: $($response.friendly_name)" -ForegroundColor White
    Write-Host "Status: $($response.status)" -ForegroundColor White
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
