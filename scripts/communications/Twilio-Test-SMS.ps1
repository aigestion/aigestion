# 📱 Twilio SMS Test - AIGestion

# Configuración
$TWILIO_ACCOUNT_SID = $env:TWILIO_ACCOUNT_SID
$TWILIO_AUTH_TOKEN = "REDACTED_TWILIO_TOKEN"
$TWILIO_PHONE_NUMBER = "+16183581369"

Write-Host "📱 Enviando SMS de prueba..." -ForegroundColor Cyan

# Crear headers
$credentials = "$TWILIO_ACCOUNT_SID`:$TWILIO_AUTH_TOKEN"
$encodedCreds = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($credentials))
$headers = @{
    'Authorization' = "Basic $encodedCreds"
    'Content-Type' = 'application/json'
}

try {
    $smsData = @{
        To = "+34618779308"
        From = $TWILIO_PHONE_NUMBER
        Body = "🚀 Twilio God Mode AIGestion - Sistema activo y funcional! $(Get-Date)"
    } | ConvertTo-Json
    
    $smsResponse = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -Method Post -Headers $headers -Body $smsData
    Write-Host "✅ SMS enviado!" -ForegroundColor Green
    Write-Host "SID: $($smsResponse.sid)" -ForegroundColor White
    Write-Host "Status: $($smsResponse.status)" -ForegroundColor White
    Write-Host "Para: $($smsResponse.to)" -ForegroundColor White
    Write-Host "Desde: $($smsResponse.from)" -ForegroundColor White
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}
