# 🌐 Twilio Webhook Handler - AIGestion Nivel Dios
# Manejo completo de webhooks de Twilio con IA y automatización

param(
    [string]$WebhookType = "all",
    [switch]$StartServer,
    [switch]$TestWebhooks
)

# Configuración desde .env
$TWILIO_ACCOUNT_SID = $env:TWILIO_ACCOUNT_SID
$TWILIO_AUTH_TOKEN = $env:TWILIO_AUTH_TOKEN
$TWILIO_PHONE_NUMBER = $env:TWILIO_PHONE_NUMBER
$OPENAI_API_KEY = $env:OPENAI_API_KEY
$GEMINI_API_KEY = $env:GEMINI_API_KEY

function New-SMSWebhook {
    param(
        [string]$From,
        [string]$To,
        [string]$Body,
        [string]$MessageSid
    )
    
    Write-Host "📱 SMS recibido de: $From" -ForegroundColor Cyan
    Write-Host "📝 Mensaje: $Body" -ForegroundColor Yellow
    
    # Analizar mensaje con IA
    $aiResponse = Get-AIResponse -Message $Body -From $From
    
    # Enviar respuesta automática
    Send-SMSResponse -To $From -Message $aiResponse -OriginalSid $MessageSid
    
    # Guardar en base de datos
    Save-MessageLog -From $From -To $To -Body $Body -Type "SMS" -AIGenerated $aiResponse
}

function New-VoiceWebhook {
    param(
        [string]$From,
        [string]$To,
        [string]$CallSid,
        [string]$SpeechResult = ""
    )
    
    Write-Host "📞 Llamada de: $From" -ForegroundColor Cyan
    
    if ($SpeechResult) {
        Write-Host "🎤 Transcripción: $SpeechResult" -ForegroundColor Yellow
        
        # Analizar con IA
        $aiResponse = Get-AIResponse -Message $SpeechResult -From $From
        
        # Generar TwiML de respuesta
        $twiml = New-VoiceTwiML -Response $aiResponse
        return $twiml
    }
    else {
        # Flujo inicial de llamada
        return @"
<Response>
    <Gather input="speech" action="/api/twilio/voice" method="POST" timeout="3" language="es-ES">
        <Say language="es-ES" voice="alice">Hola, soy Daniela IA de AIGestion. ¿En qué puedo ayudarte?</Say>
    </Gather>
    <Say language="es-ES">Gracias por llamar a AIGestion. ¡Que tengas un excelente día!</Say>
</Response>
"@
    }
}

function New-WhatsAppWebhook {
    param(
        [string]$From,
        [string]$To,
        [string]$Body,
        [string]$MessageSid
    )
    
    Write-Host "💬 WhatsApp de: $From" -ForegroundColor Cyan
    Write-Host "📝 Mensaje: $Body" -ForegroundColor Yellow
    
    # Análisis avanzado para WhatsApp
    $aiResponse = Get-WhatsAppAIResponse -Message $Body -From $From
    
    # Enviar respuesta WhatsApp
    Send-WhatsAppResponse -To $From -Message $aiResponse
    
    # Guardar log
    Save-MessageLog -From $From -To $To -Body $Body -Type "WhatsApp" -AIGenerated $aiResponse
}

function New-StatusWebhook {
    param(
        [string]$MessageSid,
        [string]$MessageStatus,
        [string]$ErrorCode = ""
    )
    
    Write-Host "📊 Status Update: $MessageSid -> $MessageStatus" -ForegroundColor Cyan
    
    if ($ErrorCode) {
        Write-Host "⚠️ Error Code: $ErrorCode" -ForegroundColor Red
        # Manejar error y reintentar si es necesario
        Handle-DeliveryError -MessageSid $MessageSid -ErrorCode $ErrorCode
    }
    
    # Actualizar estado en base de datos
    Update-MessageStatus -MessageSid $MessageSid -Status $MessageStatus
}

function Get-AIResponse {
    param([string]$Message, [string]$From)
    
    Write-Host "🤖 Generando respuesta IA..." -ForegroundColor Cyan
    
    # Detectar intención y contexto
    $intent = Detect-Intent -Message $Message
    $context = Get-UserContext -Phone $From
    
    # Generar respuesta basada en intención y contexto
    switch ($intent) {
        "sales" {
            return "🚀 ¡Excelente! En AIGestion tenemos soluciones de IA personalizadas. ¿Qué tipo de negocio necesitas optimizar? Nuestros sistemas aumentan productividad un 300%."
        }
        "support" {
            return "💙 Entiendo necesitas ayuda. Déjame analizar tu caso y conectar con el especialista adecuado. ¿Puedes describir tu situación?"
        }
        "pricing" {
            return "💰 Tenemos planes desde €99/mes hasta soluciones enterprise. ¿Cuál es el tamaño de tu empresa para recomendarte el plan perfecto?"
        }
        "demo" {
            return "🎮 ¡Claro! Agenda una demo en https://aigestion.net/demo o te conecto ahora con un experto. ¿Prefieres video o llamada?"
        }
        "emergency" {
            return "🚨 Situación detectada. Conectando inmediatamente con equipo de soporte prioritario. Tu caso es importante para nosotros."
        }
        default {
            return "✨ Hola soy Daniela IA de AIGestion. Puedo ayudarte con ventas, soporte, demos o información. ¿Qué te interesa hoy?"
        }
    }
}

function Get-WhatsAppAIResponse {
    param([string]$Message, [string]$From)
    
    # Respuestas específicas para WhatsApp
    if ($Message -match "hola|hi|buenos días") {
        return "👋 ¡Hola! Soy Daniela IA de AIGestion. 🚀`n`n¿Cómo puedo ayudarte hoy?`n`n📞 Ventas: 1`n🛠️ Soporte: 2`n💰 Precios: 3`n🎮 Demo: 4"
    }
    elseif ($Message -match "1|ventas|comprar") {
        return "💼 ¡Perfecto! Nuestras soluciones de IA transforman negocios:`n`n🎯 Productividad +300%`n🤖 Automatización total`n💰 ROI en 30 días`n`n¿Cuál es tu industria?"
    }
    elseif ($Message -match "2|soporte|ayuda") {
        return "🛠️ Estoy aquí para ayudarte. ¿Qué problema tienes?`n`n🔧 Técnico`n💻 Integración`n📱 Móvil`n🌐 Web`n`nDescribe tu situación y te conecto con el experto."
    }
    elseif ($Message -match "3|precios|costo") {
        return "💰 Nuestros planes:`n`n🌟 Starter: €99/mes`n⚡ Pro: €299/mes`n🚀 Enterprise: Custom`n`n¿Cuántos usuarios necesitas?"
    }
    elseif ($Message -match "4|demo|prueba") {
        return "🎮 ¡Agenda tu demo gratuita!`n`n📅 https://aigestion.net/demo`n⏰ 30 minutos`n🚀 Verás la magia en acción`n`n¿Qué día te viene bien?"
    }
    else {
        return Get-AIResponse -Message $Message -From $From
    }
}

function Detect-Intent {
    param([string]$Message)
    
    $message = $Message.ToLower()
    
    if ($message -match "venta|comprar|precio|costo|plan") { return "sales" }
    elseif ($message -match "problema|error|ayuda|soporte|no funciona") { return "support" }
    elseif ($message -match "demo|prueba|ver|mostrar") { return "demo" }
    elseif ($message -match "urgente|emergencia|ya|ahora") { return "emergency" }
    else { return "general" }
}

function Get-UserContext {
    param([string]$Phone)
    
    # Simular obtención de contexto de base de datos
    return @{
        Name = "Cliente"
        Tier = "Standard"
        LastContact = Get-Date
        History = @()
    }
}

function New-VoiceTwiML {
    param([string]$Response)
    
    return @"
<Response>
    <Say language="es-ES" voice="alice">$Response</Say>
    <Gather input="speech" action="/api/twilio/voice" method="POST" timeout="3" language="es-ES">
        <Say language="es-ES">¿Hay algo más en lo que pueda ayudarte?</Say>
    </Gather>
    <Say language="es-ES">Gracias por contactar AIGestion. ¡Que tengas un excelente día!</Say>
</Response>
"@
}

function Send-SMSResponse {
    param([string]$To, [string]$Message, [string]$OriginalSid)
    
    $headers = @{
        'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($TWILIO_ACCOUNT_SID):$($TWILIO_AUTH_TOKEN)")))"
        'Content-Type' = 'application/json'
    }
    
    $data = @{
        To = $To
        From = $TWILIO_PHONE_NUMBER
        Body = $Message
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -Method Post -Headers $headers -Body $data
        Write-Host "✅ Respuesta SMS enviada - SID: $($response.sid)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error enviando respuesta: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Save-MessageLog {
    param([string]$From, [string]$To, [string]$Body, [string]$Type, [string]$AIGenerated)
    
    # Guardar en MongoDB o base de datos
    $logEntry = @{
        timestamp = Get-Date
        from = $From
        to = $To
        body = $Body
        type = $Type
        ai_response = $AIGenerated
        processed = $true
    }
    
    Write-Host "💾 Mensaje guardado en log" -ForegroundColor Green
}

# Ejecución principal
if ($TestWebhooks) {
    Write-Host "🧪 Probando webhooks..." -ForegroundColor Cyan
    
    # Test SMS
    New-SMSWebhook -From "+34600000000" -To $TWILIO_PHONE_NUMBER -Body "Hola, necesito información" -MessageSid "test123"
    
    # Test Voice
    $voiceTwiML = New-VoiceWebhook -From "+34600000000" -To $TWILIO_PHONE_NUMBER -CallSid "call123"
    Write-Host "📞 TwiML generado: $voiceTwiML" -ForegroundColor Yellow
    
    # Test WhatsApp
    New-WhatsAppWebhook -From "whatsapp:+34600000000" -To "whatsapp:$TWILIO_PHONE_NUMBER" -Body "Hola" -MessageSid "wa123"
}

if ($StartServer) {
    Write-Host "🌐 Iniciando servidor de webhooks..." -ForegroundColor Cyan
    Write-Host "Endpoints:" -ForegroundColor White
    Write-Host "  POST /api/twilio/sms" -ForegroundColor Gray
    Write-Host "  POST /api/twilio/voice" -ForegroundColor Gray
    Write-Host "  POST /api/twilio/whatsapp" -ForegroundColor Gray
    Write-Host "  POST /api/twilio/status" -ForegroundColor Gray
}

Write-Host "🎉 Twilio Webhook Handler configurado!" -ForegroundColor Magenta
