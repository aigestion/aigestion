# 🇪🇸 Twilio Spain Number Check
param(
    [string]$Action = "check"
)

# Configuración
$AccountSid = $env:TWILIO_ACCOUNT_SID
$AuthToken = $env:TWILIO_AUTH_TOKEN

# Headers
$Headers = @{
    "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$AccountSid`:$AuthToken"))
}

if ($Action -eq "check") {
    Write-Host "🔍 Verificando números Twilio disponibles..."
    try {
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$AccountSid/IncomingPhoneNumbers.json" -Headers $Headers
        Write-Host "✅ Números actuales:"
        if ($response.incoming_phone_numbers.Count -eq 0) {
            Write-Host "❌ No tienes números activos"
        } else {
            $response.incoming_phone_numbers | ForEach-Object {
                Write-Host "📞 $($_.phone_number) - $($_.friendly_name)"
            }
        }
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)"
    }
}

if ($Action -eq "buy-spain") {
    Write-Host "🇪🇸 Buscando números españoles disponibles..."
    try {
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$AccountSid/AvailablePhoneNumbers/ES/Local.json?Contains=34" -Headers $Headers
        Write-Host "✅ Números disponibles:"
        if ($response.available_phone_numbers.Count -eq 0) {
            Write-Host "❌ No hay números españoles disponibles"
        } else {
            $response.available_phone_numbers | Select-Object -First 5 | ForEach-Object {
                Write-Host "📞 $($_.phone_number) - $($_.friendly_name)"
            }
        }
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)"
    }
}

if ($Action -eq "test-current") {
    Write-Host "🧪 Probando número actual..."
    try {
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$AccountSid/Calls.json" -Method POST -Headers $Headers -Body @{
            To = "+34618779308"
            From = "+16183581369"
            Url = "http://demo.twilio.com/docs/voice.xml"
            Method = "POST"
        }
        Write-Host "✅ Llamada iniciada: $($response.sid)"
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)"
    }
}

Write-Host "`n📋 Opciones:"
Write-Host "  .\Twilio-Check-Numbers.ps1 -Action 'check'      # Ver números actuales"
Write-Host "  .\Twilio-Check-Numbers.ps1 -Action 'buy-spain'  # Buscar números ES"
Write-Host "  .\Twilio-Check-Numbers.ps1 -Action 'test-current' # Probar llamada"
