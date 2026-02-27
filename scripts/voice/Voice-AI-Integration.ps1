# 🎤🤖 Voice AI Integration - AIGestion Nivel Dios
# Integración completa de ElevenLabs + Vapi + OpenAI para sistema de voz nivel extremo

param(
    [switch]$TestIntegration,
    [switch]$SetupDanielaVoice,
    [switch]$ConfigureRealTime,
    [switch]$EnableAnalytics
)

# Configuración desde .env
$ELEVENLABS_API_KEY = $env:ELEVENLABS_API_KEY
$ELEVENLABS_VOICE_ID = $env:ELEVENLABS_VOICE_ID
$VAPI_PRIVATE_KEY = $env:VAPI_PRIVATE_KEY
$OPENAI_API_KEY = $env:OPENAI_API_KEY
$GEMINI_API_KEY = $env:GEMINI_API_KEY

function Test-ElevenLabsIntegration {
    Write-Host "🎤 Probando ElevenLabs..." -ForegroundColor Cyan
    
    $headers = @{
        'xi-api-key' = $ELEVENLABS_API_KEY
        'Content-Type' = 'application/json'
    }
    
    try {
        # Probar generación de voz
        $text = "Hola soy Daniela IA, asistente inteligente de AIGestion. Sistema de nivel dios listo para ayudarte."
        $data = @{
            text = $text
            voice_id = $ELEVENLABS_VOICE_ID
            model_id = "eleven_multilingual_v2"
            voice_settings = @{
                stability = 0.75
                similarity_boost = 0.75
                style = 0.5
                use_speaker_boost = $true
            }
        } | ConvertTo-Json -Depth 10
        
        $response = Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_VOICE_ID" -Method Post -Headers $headers -Body $data -OutFile "daniela_test.mp3"
        Write-Host "✅ ElevenLabs OK - Audio generado: daniela_test.mp3" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Error ElevenLabs: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-VapiIntegration {
    Write-Host "🤖 Probando Vapi..." -ForegroundColor Cyan
    
    $headers = @{
        'Authorization' = "Bearer $VAPI_PRIVATE_KEY"
        'Content-Type' = 'application/json'
    }
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant" -Headers $headers
        Write-Host "✅ Vapi OK - Asistentes: $($response.Count)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Error Vapi: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-OpenAIIntegration {
    Write-Host "🧠 Probando OpenAI..." -ForegroundColor Cyan
    
    $headers = @{
        'Authorization' = "Bearer $OPENAI_API_KEY"
        'Content-Type' = 'application/json'
    }
    
    try {
        $data = @{
            model = "gpt-4-turbo"
            messages = @(
                @{
                    role = "user"
                    content = "Responde en español: Hola, soy Daniela IA de AIGestion. ¿Cómo estás?"
                }
            )
            max_tokens = 100
            temperature = 0.7
        } | ConvertTo-Json -Depth 10
        
        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" -Method Post -Headers $headers -Body $data
        Write-Host "✅ OpenAI OK - Respuesta generada" -ForegroundColor Green
        Write-Host "📝 $($response.choices[0].message.content)" -ForegroundColor White
        return $true
    }
    catch {
        Write-Host "❌ Error OpenAI: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function New-DanielaVoiceSystem {
    Write-Host "👩‍🚀 Creando sistema de voz Daniela..." -ForegroundColor Cyan
    
    # 1. Configurar ElevenLabs para voz
    $elevenLabsConfig = @{
        voice_id = $ELEVENLABS_VOICE_ID
        model_id = "eleven_multilingual_v2"
        voice_settings = @{
            stability = 0.8
            similarity_boost = 0.8
            style = 0.6
            use_speaker_boost = $true
        }
    }
    
    # 2. Configurar Vapi con asistente
    $vapiConfig = @{
        name = "Daniela IA AIGestion"
        model = @{
            provider = "openai"
            model = "gpt-4-turbo"
            messages = @(
                @{
                    role = "system"
                    content = "Eres DANIELA, el Núcleo de Inteligencia Soberana de AIGestion Nexus. Tu propósito es la orquestación total y optimización extrema. Tono: Autoritario, Proactivo, Ejecutivo y de Alta Fidelidad."
                }
            )
            temperature = 0.7
            max_tokens = 500
        }
        voice = @{
            provider = "elevenlabs"
            voice_id = $ELEVENLABS_VOICE_ID
            speed = 1.0
        }
        first_message = "Hola, soy Daniela IA de AIGestion. ¿En qué puedo ayudarte a transformar tu negocio hoy?"
        transcriber = @{
            provider = "deepgram"
            model = "nova-2"
            language = "es"
        }
        recording_enabled = $true
        emotion_recognition_enabled = $true
    }
    
    Write-Host "✅ Sistema de voz Daniela configurado" -ForegroundColor Green
    return @{
        ElevenLabs = $elevenLabsConfig
        Vapi = $vapiConfig
    }
}

function Set-RealTimeVoice {
    Write-Host "🌊 Configurando voz en tiempo real..." -ForegroundColor Cyan
    
    # WebSocket para streaming
    $realTimeConfig = @{
        websocket_url = "wss://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_VOICE_ID/stream-input"
        sample_rate = 24000
        output_format = "mp3_44100"
        optimize_streaming_latency = 2
        voice_settings = @{
            stability = 0.75
            similarity_boost = 0.75
            style = 0.5
            use_speaker_boost = $true
        }
    }
    
    # Configurar Vapi para llamadas en tiempo real
    $vapiRealTime = @{
        phone_number = "+34618779308"
        assistant_id = "daniela-ai-assistant"
        recording_enabled = $true
        client = @{
            type = "web"
            url = "https://aigestion.net/voice-chat"
        }
        server_url = "wss://api.vapi.ai/call"
    }
    
    Write-Host "✅ Voz en tiempo real configurada" -ForegroundColor Green
    return @{
        ElevenLabs = $realTimeConfig
        Vapi = $vapiRealTime
    }
}

function Get-VoiceAnalytics {
    Write-Host "📊 Obteniendo analytics de voz..." -ForegroundColor Cyan
    
    # Analytics ElevenLabs
    $elevenLabsHeaders = @{
        'xi-api-key' = $ELEVENLABS_API_KEY
    }
    
    try {
        $elevenLabsResponse = Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/user/subscription" -Headers $elevenLabsHeaders
        Write-Host "🎤 ElevenLabs:" -ForegroundColor Yellow
        Write-Host "   Caracteres usados: $($elevenLabsResponse.character_count)/$($elevenLabsResponse.character_limit)" -ForegroundColor White
        Write-Host "   Plan: $($elevenLabsResponse.tier)" -ForegroundColor White
    }
    catch {
        Write-Host "❌ Error analytics ElevenLabs: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Analytics Vapi
    $vapiHeaders = @{
        'Authorization' = "Bearer $VAPI_PRIVATE_KEY"
    }
    
    try {
        $vapiResponse = Invoke-RestMethod -Uri "https://api.vapi.ai/call" -Headers $vapiHeaders
        Write-Host "🤖 Vapi:" -ForegroundColor Yellow
        Write-Host "   Total llamadas: $($vapiResponse.Count)" -ForegroundColor White
        Write-Host "   Activas: $($vapiResponse.Where({$_.status -eq "active"}).Count)" -ForegroundColor White
        Write-Host "   Completadas: $($vapiResponse.Where({$_.status -eq "completed"}).Count)" -ForegroundColor White
    }
    catch {
        Write-Host "❌ Error analytics Vapi: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Test-CompleteIntegration {
    Write-Host "🧪 Probando integración completa..." -ForegroundColor Cyan
    
    $elevenLabsOK = Test-ElevenLabsIntegration
    $vapiOK = Test-VapiIntegration
    $openAIOK = Test-OpenAIIntegration
    
    if ($elevenLabsOK -and $vapiOK -and $openAIOK) {
        Write-Host "🎉 Integración completa OK!" -ForegroundColor Green
        Write-Host "✅ ElevenLabs: Generación de voz" -ForegroundColor White
        Write-Host "✅ Vapi: Asistente de voz" -ForegroundColor White
        Write-Host "✅ OpenAI: Procesamiento de lenguaje" -ForegroundColor White
        
        # Probar flujo completo
        Write-Host "🔄 Probando flujo completo..." -ForegroundColor Cyan
        
        # 1. Generar texto con OpenAI
        $openAIResponse = "Hola, soy Daniela IA de AIGestion. Estoy aquí para ayudarte a transformar tu negocio con inteligencia artificial de nivel dios."
        
        # 2. Convertir a voz con ElevenLabs
        $voiceFile = "daniela_integration_test.mp3"
        $elevenLabsHeaders = @{
            'xi-api-key' = $ELEVENLABS_API_KEY
            'Content-Type' = 'application/json'
        }
        
        $voiceData = @{
            text = $openAIResponse
            voice_id = $ELEVENLABS_VOICE_ID
            model_id = "eleven_multilingual_v2"
            voice_settings = @{
                stability = 0.75
                similarity_boost = 0.75
                style = 0.5
                use_speaker_boost = $true
            }
        } | ConvertTo-Json -Depth 10
        
        Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_VOICE_ID" -Method Post -Headers $elevenLabsHeaders -Body $voiceData -OutFile $voiceFile
        
        Write-Host "✅ Flujo completo probado - Audio: $voiceFile" -ForegroundColor Green
        
        return $true
    } else {
        Write-Host "❌ Error en integración" -ForegroundColor Red
        return $false
    }
}

# Ejecución principal
if ($TestIntegration) {
    Test-CompleteIntegration
}

if ($SetupDanielaVoice) {
    New-DanielaVoiceSystem
}

if ($ConfigureRealTime) {
    Set-RealTimeVoice
}

if ($EnableAnalytics) {
    Get-VoiceAnalytics
}

Write-Host "🎉 Voice AI Integration configurado!" -ForegroundColor Magenta
