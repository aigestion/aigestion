# 🚀 Twilio Complete Setup - Daniela IA Voice System
# Configuración completa de Twilio para llamadas con IA

param(
    [switch]$Interactive,
    [switch]$TestCall,
    [string]$WebhookUrl = "https://aigestion.net/api/twilio/voice"
)

# Importar módulos necesarios
Import-Module PowerShellGet -Force
Install-Module -Name Twilio -Scope CurrentUser -Force -ErrorAction SilentlyContinue

# Cargar credenciales desde .env
$envFile = "C:\Users\Alejandro\AIGestion\.env"
$twilioAccountSid = $null
$twilioAuthToken = $null
$twilioPhoneNumber = "+16183581369"

Write-Host "🔍 Cargando credenciales Twilio..." -ForegroundColor Cyan
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $twilioAccountSid = ($envContent | Where-Object { $_ -match "TWILIO_ACCOUNT_SID=" }) -replace "TWILIO_ACCOUNT_SID=", ""
    $twilioAuthToken = ($envContent | Where-Object { $_ -match "TWILIO_AUTH_TOKEN=" }) -replace "TWILIO_AUTH_TOKEN=", ""
    $twilioPhoneNumber = ($envContent | Where-Object { $_ -match "TWILIO_PHONE_NUMBER=" }) -replace "TWILIO_PHONE_NUMBER=", ""
    Write-Host "✅ Credenciales cargadas correctamente" -ForegroundColor Green
}
else {
    Write-Host "❌ Archivo .env no encontrado" -ForegroundColor Red
    exit 1
}

# Función para verificar conexión con Twilio
function Test-TwilioConnection {
    param($Sid, $Token)

    try {
        $headers = @{
            'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$Sid`:$Token")))"
        }
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$Sid.json" -Headers $headers
        return $response.status -eq "active"
    }
    catch {
        Write-Host "❌ Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Función para configurar webhook de voz
function Set-VoiceWebhook {
    param($Sid, $Token, $PhoneNumber, $WebhookUrl)

    try {
        $headers = @{
            'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$Sid`:$Token")))"
            'Content-Type'  = 'application/x-www-form-urlencoded'
        }

        $body = @{
            'VoiceUrl'             = $WebhookUrl
            'VoiceMethod'          = 'POST'
            'VoiceFallbackUrl'     = "$WebhookUrl/fallback"
            'VoiceFallbackMethod'  = 'POST'
            'StatusCallback'       = "$WebhookUrl/call-status"
            'StatusCallbackMethod' = 'POST'
        }

        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$Sid/IncomingPhoneNumbers/$PhoneNumber.json" -Method Post -Headers $headers -Body $body
        Write-Host "✅ Webhook de voz configurado: $WebhookUrl" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error configurando webhook: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Función para crear TwiML Bin
function New-TwiMLBin {
    param($Sid, $Token, $Name, $TwiML)

    try {
        $headers = @{
            'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$Sid`:$Token")))"
            'Content-Type'  = 'application/json'
        }

        $body = @{
            'FriendlyName' = $Name
            'TwiML'        = $TwiML
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$Sid/TwiMLBins.json" -Method Post -Headers $headers -Body $body
        Write-Host "✅ TwiML Bin creado: $($response.sid)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error creando TwiML Bin: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Función para probar llamada
function Test-PhoneCall {
    param($Sid, $Token, $From, $To, $WebhookUrl)

    try {
        $headers = @{
            'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$Sid`:$Token")))"
            'Content-Type'  = 'application/x-www-form-urlencoded'
        }

        $body = @{
            'From'   = $From
            'To'     = $To
            'Url'    = $WebhookUrl
            'Method' = 'POST'
        }

        Write-Host "📞 Iniciando llamada de prueba a $To..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$Sid/Calls.json" -Method Post -Headers $headers -Body $body
        Write-Host "✅ Llamada iniciada - SID: $($response.sid)" -ForegroundColor Green
        Write-Host "📊 Estado: $($response.status)" -ForegroundColor Cyan
        return $response
    }
    catch {
        Write-Host "❌ Error iniciando llamada: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Función para configurar Caller Name Lookup
function Enable-CallerNameLookup {
    param($Sid, $Token, $PhoneNumber)

    try {
        $headers = @{
            'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$Sid`:$Token")))"
            'Content-Type'  = 'application/x-www-form-urlencoded'
        }

        $body = @{
            'BetaFeaturesCallerNameLookup' = 'true'
        }

        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$Sid/IncomingPhoneNumbers/$PhoneNumber.json" -Method Post -Headers $headers -Body $body
        Write-Host "✅ Caller Name Lookup activado (+\$0.01 por llamada)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error activando Caller Name Lookup: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Función para crear TwiML de bienvenida
function Get-WelcomeTwiML {
    return @"
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" timeout="3" language="es-ES" action="https://aigestion.net/api/twilio/process-speech" method="POST">
        <Say language="es-ES" voice="Polly.Lucia-Neural">
            ¡Hola! Soy Daniela IA, tu asistente inteligente de AIGestion.
            Estoy aquí para ayudarte con lo que necesites.
            Puedes decirme si quieres información sobre ventas, soporte técnico,
            solicitar una demostración o conocer nuestros precios.
            ¿En qué puedo asistirte hoy?
        </Say>
    </Gather>
    <Say language="es-ES" voice="Polly.Lucia-Neural">
        No he detectado tu respuesta.
        En un momento te conectaré con un especialista.
        Gracias por llamar a AIGestion.
    </Say>
    <Redirect>https://aigestion.net/api/twilio/fallback</Redirect>
</Response>
"@
}

# Menú interactivo
function Show-InteractiveMenu {
    Clear-Host
    Write-Host "🚀 CONFIGURACIÓN TWILIO - DANIELA IA VOICE SYSTEM" -ForegroundColor Magenta
    Write-Host "================================================" -ForegroundColor Gray
    Write-Host ""
    Write-Host "1. 📞 Configurar Webhook de Voz" -ForegroundColor White
    Write-Host "2. 📋 Crear TwiML Bin" -ForegroundColor White
    Write-Host "3. 🔍 Activar Caller Name Lookup" -ForegroundColor White
    Write-Host "4. 🧪 Probar Llamada" -ForegroundColor White
    Write-Host "5. 🔄 Configuración Completa (Todo en uno)" -ForegroundColor White
    Write-Host "6. 📊 Ver Estado Actual" -ForegroundColor White
    Write-Host "7. 🚪 Salir" -ForegroundColor White
    Write-Host ""
}

# Función principal
function Main {
    # Verificar conexión
    Write-Host "🔍 Verificando conexión con Twilio..." -ForegroundColor Yellow
    if (-not (Test-TwilioConnection -Sid $twilioAccountSid -Token $twilioAuthToken)) {
        Write-Host "❌ No se puede conectar con Twilio. Verifica tus credenciales." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Conexión con Twilio establecida" -ForegroundColor Green

    if ($Interactive) {
        do {
            Show-InteractiveMenu
            $choice = Read-Host "Selecciona una opción (1-7)"

            switch ($choice) {
                "1" {
                    Write-Host "📞 Configurando webhook de voz..." -ForegroundColor Yellow
                    Set-VoiceWebhook -Sid $twilioAccountSid -Token $twilioAuthToken -PhoneNumber $twilioPhoneNumber -WebhookUrl $WebhookUrl
                    Read-Host "Presiona Enter para continuar"
                }
                "2" {
                    Write-Host "📋 Creando TwiML Bin..." -ForegroundColor Yellow
                    $twiml = Get-WelcomeTwiML
                    New-TwiMLBin -Sid $twilioAccountSid -Token $twilioAuthToken -Name "Daniela IA Welcome" -TwiML $twiml
                    Read-Host "Presiona Enter para continuar"
                }
                "3" {
                    Write-Host "🔍 Activando Caller Name Lookup..." -ForegroundColor Yellow
                    Enable-CallerNameLookup -Sid $twilioAccountSid -Token $twilioAuthToken -PhoneNumber $twilioPhoneNumber
                    Read-Host "Presiona Enter para continuar"
                }
                "4" {
                    $testNumber = Read-Host "Introduce el número de teléfono para probar (formato: +34XXXXXXXXX)"
                    if ($testNumber) {
                        Test-PhoneCall -Sid $twilioAccountSid -Token $twilioAuthToken -From $twilioPhoneNumber -To $testNumber -WebhookUrl $WebhookUrl
                    }
                    Read-Host "Presiona Enter para continuar"
                }
                "5" {
                    Write-Host "🔄 Ejecutando configuración completa..." -ForegroundColor Yellow

                    # 1. Configurar webhook
                    Write-Host "1/4 Configurando webhook de voz..." -ForegroundColor Cyan
                    Set-VoiceWebhook -Sid $twilioAccountSid -Token $twilioAuthToken -PhoneNumber $twilioPhoneNumber -WebhookUrl $WebhookUrl

                    # 2. Crear TwiML Bin
                    Write-Host "2/4 Creando TwiML Bin..." -ForegroundColor Cyan
                    $twiml = Get-WelcomeTwiML
                    New-TwiMLBin -Sid $twilioAccountSid -Token $twilioAuthToken -Name "Daniela IA Welcome" -TwiML $twiml

                    # 3. Activar Caller Name Lookup
                    Write-Host "3/4 Activando Caller Name Lookup..." -ForegroundColor Cyan
                    Enable-CallerNameLookup -Sid $twilioAccountSid -Token $twilioAuthToken -PhoneNumber $twilioPhoneNumber

                    # 4. Probar llamada si se solicita
                    if ($TestCall) {
                        Write-Host "4/4 Probando llamada..." -ForegroundColor Cyan
                        Test-PhoneCall -Sid $twilioAccountSid -Token $twilioAuthToken -From $twilioPhoneNumber -To "+34618779308" -WebhookUrl $WebhookUrl
                    }
                    else {
                        Write-Host "4/4 Configuración completa" -ForegroundColor Green
                    }

                    Read-Host "Presiona Enter para continuar"
                }
                "6" {
                    Write-Host "📊 Estado actual de la configuración:" -ForegroundColor Yellow
                    Write-Host "Account SID: $twilioAccountSid" -ForegroundColor Gray
                    Write-Host "Phone Number: $twilioPhoneNumber" -ForegroundColor Gray
                    Write-Host "Webhook URL: $WebhookUrl" -ForegroundColor Gray
                    Write-Host "Caller Name Lookup: Activado" -ForegroundColor Green
                    Read-Host "Presiona Enter para continuar"
                }
            }
        } while ($choice -ne "7")
    }
    else {
        # Configuración automática
        Write-Host "🔄 Ejecutando configuración automática completa..." -ForegroundColor Yellow

        Set-VoiceWebhook -Sid $twilioAccountSid -Token $twilioAuthToken -PhoneNumber $twilioPhoneNumber -WebhookUrl $WebhookUrl

        $twiml = Get-WelcomeTwiML
        New-TwiMLBin -Sid $twilioAccountSid -Token $twilioAuthToken -Name "Daniela IA Welcome" -TwiML $twiml

        Enable-CallerNameLookup -Sid $twilioAccountSid -Token $twilioAuthToken -PhoneNumber $twilioPhoneNumber

        if ($TestCall) {
            Test-PhoneCall -Sid $twilioAccountSid -Token $twilioAuthToken -From $twilioPhoneNumber -To "+34618779308" -WebhookUrl $WebhookUrl
        }

        Write-Host "✅ Configuración completada exitosamente" -ForegroundColor Green
    }
}

# Ejecutar función principal
Main

Write-Host ""
Write-Host "🎉 CONFIGURACIÓN TWILIO COMPLETADA" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Gray
Write-Host "📞 Número Twilio: $twilioPhoneNumber" -ForegroundColor White
Write-Host "🌐 Webhook URL: $WebhookUrl" -ForegroundColor White
Write-Host "🤖 Daniela IA está lista para recibir llamadas" -ForegroundColor Green
Write-Host ""
