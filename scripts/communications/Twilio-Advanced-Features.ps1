# 🚀 Twilio Advanced Features - AIGestion Nivel Dios
# Características avanzadas de Twilio con IA y automatización

param(
    [string]$Action = "list",
    [string]$To = "",
    [string]$Message = "",
    [switch]$Voice,
    [switch]$WhatsApp,
    [switch]$Video,
    [switch]$Analytics
)

# Configuración desde .env
$TWILIO_ACCOUNT_SID = $env:TWILIO_ACCOUNT_SID
$TWILIO_AUTH_TOKEN = $env:TWILIO_AUTH_TOKEN
$TWILIO_PHONE_NUMBER = $env:TWILIO_PHONE_NUMBER

$headers = @{
    'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($TWILIO_ACCOUNT_SID):$($TWILIO_AUTH_TOKEN)")))"
    'Content-Type' = 'application/json'
}

function Send-SmartMessage {
    param([string]$To, [string]$Message)
    
    Write-Host "🤖 Enviando mensaje inteligente..." -ForegroundColor Cyan
    
    # Analizar sentimiento con IA
    $aiAnalysis = Get-AIAnalysis -Text $Message
    
    # Personalizar mensaje según análisis
    $personalizedMessage = Get-PersonalizedMessage -Original $Message -Analysis $aiAnalysis
    
    $data = @{
        To = $To
        From = $TWILIO_PHONE_NUMBER
        Body = $personalizedMessage
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -Method Post -Headers $headers -Body $data
        Write-Host "✅ Mensaje inteligente enviado - SID: $($response.sid)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Start-VoiceCall {
    param([string]$To)
    
    Write-Host "📞 Iniciando llamada con IA..." -ForegroundColor Cyan
    
    $twiml = @"
<Response>
    <Gather input="speech" timeout="3" language="es-ES">
        <Say language="es-ES">Hola, soy Daniela IA de AIGestion. ¿En qué puedo ayudarte?</Say>
    </Gather>
    <Say language="es-ES">No detecté respuesta. Gracias por llamar a AIGestion.</Say>
</Response>
"@
    
    $data = @{
        To = $To
        From = $TWILIO_PHONE_NUMBER
        Twiml = $twiml
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Calls.json" -Method Post -Headers $headers -Body $data
        Write-Host "✅ Llamada iniciada - SID: $($response.sid)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Send-WhatsAppMessage {
    param([string]$To, [string]$Message)
    
    Write-Host "💬 Enviando mensaje WhatsApp..." -ForegroundColor Cyan
    
    $data = @{
        To = "whatsapp:$To"
        From = "whatsapp:$TWILIO_PHONE_NUMBER"
        Body = $Message
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -Method Post -Headers $headers -Body $data
        Write-Host "✅ WhatsApp enviado - SID: $($response.sid)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error WhatsApp: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Create-VideoRoom {
    param([string]$RoomName = "aigestion-meeting")
    
    Write-Host "🎥 Creando sala de video..." -ForegroundColor Cyan
    
    $data = @{
        enableTurn = $true
        type = "group"
        recordParticipantsOnConnect = $true
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://video.twilio.com/v1/Rooms" -Method Post -Headers $headers -Body $data
        Write-Host "✅ Sala creada - SID: $($response.sid)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error creando sala: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Get-Analytics {
    Write-Host "📊 Obteniendo analytics..." -ForegroundColor Cyan
    
    try {
        # Obtener uso de mensajes
        $messages = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json?PageSize=50" -Headers $headers
        
        # Obtener uso de llamadas
        $calls = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Calls.json?PageSize=50" -Headers $headers
        
        Write-Host "📈 Estadísticas:" -ForegroundColor Yellow
        Write-Host "   Mensajes enviados: $($messages.messages.Count)" -ForegroundColor White
        Write-Host "   Llamadas realizadas: $($calls.calls.Count)" -ForegroundColor White
        
        return @{
            Messages = $messages.messages.Count
            Calls = $calls.calls.Count
        }
    }
    catch {
        Write-Host "❌ Error obteniendo analytics: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Get-AIAnalysis {
    param([string]$Text)
    
    # Simular análisis de IA (integrar con OpenAI/Gemini real)
    return @{
        sentiment = "positive"
        urgency = "normal"
        category = "inquiry"
    }
}

function Get-PersonalizedMessage {
    param([string]$Original, [object]$Analysis)
    
    # Personalizar mensaje basado en análisis
    if ($Analysis.urgency -eq "high") {
        return "⚡ URGENTE: $Original"
    }
    elseif ($Analysis.sentiment -eq "negative") {
        return "💙 Entendemos tu preocupación: $Original"
    }
    else {
        return "✨ $Original"
    }
}

# Ejecución principal
switch ($Action) {
    "sms" { 
        if ($To -and $Message) { 
            Send-SmartMessage -To $To -Message $Message 
        } else {
            Write-Host "❌ Se requiere -To y -Message para SMS" -ForegroundColor Red
        }
    }
    "voice" { 
        if ($To) { 
            Start-VoiceCall -To $To 
        } else {
            Write-Host "❌ Se requiere -To para llamada" -ForegroundColor Red
        }
    }
    "whatsapp" { 
        if ($To -and $Message) { 
            Send-WhatsAppMessage -To $To -Message $Message 
        } else {
            Write-Host "❌ Se requiere -To y -Message para WhatsApp" -ForegroundColor Red
        }
    }
    "video" { 
        Create-VideoRoom 
    }
    "analytics" { 
        Get-Analytics 
    }
    default { 
        Write-Host "🚀 Twilio Advanced Features - AIGestion" -ForegroundColor Magenta
        Write-Host "Acciones disponibles: sms, voice, whatsapp, video, analytics" -ForegroundColor White
    }
}
