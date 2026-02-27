# 🧪 Twilio Config Test - AIGestion

# Configuración manual desde .env
$TWILIO_ACCOUNT_SID = $env:TWILIO_ACCOUNT_SID
$TWILIO_AUTH_TOKEN = $env:TWILIO_AUTH_TOKEN
$TWILIO_PHONE_NUMBER = "+16183581369"

Write-Host "🚀 Probando Twilio..." -ForegroundColor Cyan
Write-Host "Account SID: $TWILIO_ACCOUNT_SID" -ForegroundColor Yellow
Write-Host "Phone: $TWILIO_PHONE_NUMBER" -ForegroundColor Yellow

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
    
    # Probar SMS
    Write-Host "📱 Enviando SMS de prueba..." -ForegroundColor Cyan
    $smsData = @{
        To = "+34618779308"
        From = $TWILIO_PHONE_NUMBER
        Body = "🚀 Twilio God Mode AIGestion - Sistema activo!"
    } | ConvertTo-Json
    
    $smsResponse = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -Method Post -Headers $headers -Body $smsData
    Write-Host "✅ SMS enviado!" -ForegroundColor Green
    Write-Host "SID: $($smsResponse.sid)" -ForegroundColor White
    Write-Host "Status: $($smsResponse.status)" -ForegroundColor White
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}
