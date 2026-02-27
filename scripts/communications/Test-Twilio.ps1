# 🧪 Test Twilio Connection - AIGestion
# Script simple para probar conexión con Twilio

# Cargar variables de entorno desde .env
$envFile = ".\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

# Configuración Twilio
$TWILIO_ACCOUNT_SID = $env:TWILIO_ACCOUNT_SID
$TWILIO_AUTH_TOKEN = $env:TWILIO_AUTH_TOKEN
$TWILIO_PHONE_NUMBER = $env:TWILIO_PHONE_NUMBER

Write-Host "🚀 Probando conexión Twilio..." -ForegroundColor Cyan
Write-Host "Account SID: $TWILIO_ACCOUNT_SID" -ForegroundColor Yellow
Write-Host "Phone Number: $TWILIO_PHONE_NUMBER" -ForegroundColor Yellow

# Headers para API
$headers = @{
    'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($TWILIO_ACCOUNT_SID):$($TWILIO_AUTH_TOKEN)")))"
    'Content-Type'  = 'application/json'
}

try {
    $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID.json" -Headers $headers
    Write-Host "✅ Conexión exitosa!" -ForegroundColor Green
    Write-Host "Cuenta: $($response.friendly_name)" -ForegroundColor White
    Write-Host "Status: $($response.status)" -ForegroundColor White
    Write-Host "Tipo: $($response.type)" -ForegroundColor White

    # Probar enviar SMS de prueba
    $testNumber = "+34618779308" # Número de prueba
    $message = "🚀 Twilio God Mode AIGestion - Sistema activo y funcional!"

    Write-Host "📱 Enviando SMS de prueba..." -ForegroundColor Cyan

    $data = @{
        To   = $testNumber
        From = $TWILIO_PHONE_NUMBER
        Body = $message
    } | ConvertTo-Json

    $smsResponse = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -Method Post -Headers $headers -Body $data
    Write-Host "✅ SMS enviado!" -ForegroundColor Green
    Write-Host "SID: $($smsResponse.sid)" -ForegroundColor White
    Write-Host "Status: $($smsResponse.status)" -ForegroundColor White

}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "StatusCode: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    }
}
