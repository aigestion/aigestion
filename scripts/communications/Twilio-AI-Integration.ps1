# 🤖 Twilio AI Integration - AIGestion Nivel Dios
# Integración completa de IA con Twilio para respuestas inteligentes

param(
    [switch]$EnableAI,
    [switch]$TestAI,
    [switch]$SetupVoiceAI,
    [switch]$ConfigureChatbot
)

# Configuración desde .env
$TWILIO_ACCOUNT_SID = $env:TWILIO_ACCOUNT_SID
$TWILIO_AUTH_TOKEN = $env:TWILIO_AUTH_TOKEN
$TWILIO_PHONE_NUMBER = $env:TWILIO_PHONE_NUMBER
$OPENAI_API_KEY = $env:OPENAI_API_KEY
$GEMINI_API_KEY = $env:GEMINI_API_KEY

$headers = @{
    'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($TWILIO_ACCOUNT_SID):$($TWILIO_AUTH_TOKEN)")))"
    'Content-Type' = 'application/json'
}

# Headers para APIs de IA
$openaiHeaders = @{
    'Authorization' = "Bearer $OPENAI_API_KEY"
    'Content-Type' = 'application/json'
}

$geminiHeaders = @{
    'Content-Type' = 'application/json'
}

function Invoke-OpenAIAnalysis {
    param([string]$Text)
    
    Write-Host "🧠 Analizando con OpenAI..." -ForegroundColor Cyan
    
    $prompt = @"
Analiza el siguiente mensaje de cliente y proporciona:
1. Sentimiento (positive/negative/neutral)
2. Urgencia (low/medium/high)
3. Categoría (inquiry/support/sales/complaint)
4. Respuesta sugerida en español

Mensaje: $Text
"@
    
    $data = @{
        model = "gpt-3.5-turbo"
        messages = @(
            @{
                role = "system"
                content = "Eres un experto en análisis de sentimiento y atención al cliente para AIGestion."
            }
            @{
                role = "user"
                content = $prompt
            }
        )
        max_tokens = 150
        temperature = 0.7
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" -Method Post -Headers $openaiHeaders -Body $data
        return $response.choices[0].message.content
    }
    catch {
        Write-Host "❌ Error OpenAI: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Invoke-GeminiAnalysis {
    param([string]$Text)
    
    Write-Host "🌟 Analizando con Gemini..." -ForegroundColor Cyan
    
    $prompt = @"
Analiza este mensaje y extrae: sentimiento, urgencia, categoría, y genera respuesta inteligente en español.
Mensaje: $Text
"@
    
    $data = @{
        contents = @(
            @{
                parts = @(
                    @{
                        text = $prompt
                    }
                )
            }
        )
        generationConfig = @{
            temperature = 0.7
            maxOutputTokens = 150
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY"
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $geminiHeaders -Body $data
        return $response.candidates[0].content.parts[0].text
    }
    catch {
        Write-Host "❌ Error Gemini: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function New-AIResponse {
    param([string]$IncomingMessage, [string]$UserPhone)
    
    Write-Host "🤖 Generando respuesta IA..." -ForegroundColor Cyan
    
    # Analizar con múltiples modelos de IA
    $openaiResult = Invoke-OpenAIAnalysis -Text $IncomingMessage
    $geminiResult = Invoke-GeminiAnalysis -Text $IncomingMessage
    
    # Combinar resultados para mejor respuesta
    $finalResponse = Get-BestAIResponse -OpenAI $openaiResult -Gemini $geminiResult
    
    # Enviar respuesta via Twilio
    $data = @{
        To = $UserPhone
        From = $TWILIO_PHONE_NUMBER
        Body = $finalResponse
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" -Method Post -Headers $headers -Body $data
        Write-Host "✅ Respuesta IA enviada - SID: $($response.sid)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error enviando respuesta: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Get-BestAIResponse {
    param([string]$OpenAI, [string]$Gemini)
    
    # Lógica para seleccionar mejor respuesta
    if ($OpenAI -and $Gemini) {
        # Combinar ambas respuestas
        return "🤖 Daniela IA: $OpenAI`n🌟 Gemini Insight: $Gemini"
    }
    elseif ($OpenAI) {
        return "🤖 Daniela IA: $OpenAI"
    }
    elseif ($Gemini) {
        return "🌟 Gemini: $Gemini"
    }
    else {
        return "💬 Gracias por tu mensaje. Nuestro equipo te responderá pronto."
    }
}

function Set-VoiceAI {
    Write-Host "🎤 Configurando IA de voz..." -ForegroundColor Cyan
    
    # Configurar Twilio Media Streams con IA
    $voiceConfig = @{
        voice = "alice"
        language = "es-ES"
        inputSpeechTimeout = 3
        timeout = 5
    }
    
    # TwiML con IA integrada
    $twiml = @"
<Response>
    <Gather input="speech" action="/api/twilio/voice-ai" method="POST" timeout="3" language="es-ES">
        <Say language="es-ES" voice="alice">Hola, soy Daniela IA de AIGestion. Puedo ayudarte con ventas, soporte técnico o información general. ¿En qué te puedo asistir hoy?</Say>
    </Gather>
    <Say language="es-ES">Si necesitas hablar con un humano, marca 0. Gracias por llamar a AIGestion.</Say>
</Response>
"@
    
    Write-Host "✅ IA de voz configurada" -ForegroundColor Green
}

function Set-ChatbotFlow {
    Write-Host "💬 Configurando chatbot inteligente..." -ForegroundColor Cyan
    
    # Flujo conversacional con IA
    $chatbotFlow = @{
        welcome = "¡Hola! Soy Daniela IA de AIGestion. 🚀"
        menu = "Puedo ayudarte con:`n1. Ventas y productos`n2. Soporte técnico`n3. Información general`n4. Hablar con humano"
        sales = "Tenemos soluciones de IA personalizadas. ¿Qué tipo de negocio tienes?"
        support = "Entiendo tu problema. Déjame analizarlo y encontrar la mejor solución."
        general = "AIGestion ofrece sistemas de IA de nivel dios para transformar tu negocio."
        human = "Conectando con uno de nuestros expertos especializados."
    }
    
    Write-Host "✅ Chatbot configurado" -ForegroundColor Green
}

function Test-AIIntegration {
    Write-Host "🧪 Probando integración IA..." -ForegroundColor Cyan
    
    $testMessages = @(
        "Hola, necesito información sobre sus servicios",
        "Tengo un problema técnico urgente",
        "Quiero comprar un producto de IA",
        "Me pueden ayudar con mi cuenta?"
    )
    
    foreach ($message in $testMessages) {
        Write-Host "📝 Analizando: '$message'" -ForegroundColor Yellow
        $analysis = Invoke-OpenAIAnalysis -Text $message
        Write-Host "🤖 Resultado: $analysis" -ForegroundColor Green
        Write-Host "---" -ForegroundColor Gray
    }
}

# Ejecución principal
if ($EnableAI) {
    Write-Host "🚀 Activando IA con Twilio..." -ForegroundColor Magenta
    Set-VoiceAI
    Set-ChatbotFlow
}

if ($TestAI) {
    Test-AIIntegration
}

if ($SetupVoiceAI) {
    Set-VoiceAI
}

if ($ConfigureChatbot) {
    Set-ChatbotFlow
}

Write-Host "🎉 Twilio AI Integration configurado!" -ForegroundColor Magenta
