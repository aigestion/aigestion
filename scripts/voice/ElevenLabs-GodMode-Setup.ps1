# 🎤 ElevenLabs God Mode Setup - AIGestion Nivel Dios
# Configuración completa de ElevenLabs para voces de IA nivel extremo

param(
    [switch]$Interactive,
    [switch]$TestVoices,
    [switch]$CreateCustomVoice,
    [switch]$SetupStreaming,
    [switch]$ConfigureDaniela
)

# Configuración desde .env
$ELEVENLABS_API_KEY = $env:ELEVENLABS_API_KEY
$ELEVENLABS_VOICE_ID = $env:ELEVENLABS_VOICE_ID
$ELEVENLABS_VOICE_ID_ALT = $env:ELEVENLABS_VOICE_ID_ALT

$headers = @{
    'xi-api-key' = $ELEVENLABS_API_KEY
    'Content-Type' = 'application/json'
}

function Test-ElevenLabsConnection {
    Write-Host "🎤 Probando conexión ElevenLabs..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/user" -Headers $headers
        Write-Host "✅ Conexión exitosa - Usuario: $($response.subscription.tier)" -ForegroundColor Green
        Write-Host "Caracteres disponibles: $($response.subscription.character_count)/$($response.subscription.character_limit)" -ForegroundColor White
        return $true
    }
    catch {
        Write-Host "❌ Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Get-AvailableVoices {
    Write-Host "🎭 Obteniendo voces disponibles..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/voices" -Headers $headers
        $voices = $response.voices | Where-Object { $_.category -eq "premade" }
        
        Write-Host "✅ Voces encontradas: $($voices.Count)" -ForegroundColor Green
        Write-Host "🌟 Voces en español:" -ForegroundColor Yellow
        
        $spanishVoices = $voices | Where-Object { $_.language -match "es" }
        foreach ($voice in $spanishVoices) {
            Write-Host "   • $($voice.name) - ID: $($voice.voice_id)" -ForegroundColor White
        }
        
        return $voices
    }
    catch {
        Write-Host "❌ Error obteniendo voces: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Test-VoiceGeneration {
    param([string]$VoiceId = $ELEVENLABS_VOICE_ID)
    
    Write-Host "🗣️ Probando generación de voz..." -ForegroundColor Cyan
    
    $text = "🚀 ¡Hola! Soy Daniela IA de AIGestion. Sistema de inteligencia artificial nivel dios, listo para transformar tu negocio."
    
    $data = @{
        text = $text
        voice_id = $VoiceId
        model_id = "eleven_multilingual_v2"
        voice_settings = @{
            stability = 0.75
            similarity_boost = 0.75
            style = 0.5
            use_speaker_boost = $true
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/text-to-speech/$VoiceId" -Method Post -Headers $headers -Body $data -OutFile "temp_daniela.mp3"
        Write-Host "✅ Voz generada - Archivo: temp_daniela.mp3" -ForegroundColor Green
        Write-Host "📊 Tamaño: $([math]::Round((Get-Item "temp_daniela.mp3").Length / 1KB, 2)) KB" -ForegroundColor White
        
        # Reproducir audio si está disponible
        if (Get-Command "Start-Process" -ErrorAction SilentlyContinue) {
            Write-Host "🔊 Reproduciendo audio..." -ForegroundColor Cyan
            Start-Process "temp_daniela.mp3"
        }
        
        return $true
    }
    catch {
        Write-Host "❌ Error generando voz: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function New-DanielaCustomVoice {
    Write-Host "👤 Creando voz personalizada para Daniela..." -ForegroundColor Cyan
    
    $voiceData = @{
        name = "Daniela IA AIGestion"
        description = "Voz personalizada de Daniela IA para AIGestion - Inteligencia artificial nivel dios"
        language = "es"
        accent = "spanish"
        gender = "female"
        age = "young"
        use_case = "news"
        voice_description = "Profesional, amigable, autoritaria pero accesible. Perfecta para asistente de IA empresarial."
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/voices/add" -Method Post -Headers $headers -Body $voiceData
        Write-Host "✅ Voz personalizada creada - ID: $($response.voice_id)" -ForegroundColor Green
        return $response.voice_id
    }
    catch {
        Write-Host "❌ Error creando voz: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Set-StreamingConfig {
    Write-Host "🌊 Configurando streaming en tiempo real..." -ForegroundColor Cyan
    
    $webhookUrl = "https://aigestion.net/api/elevenlabs/webhook"
    
    $streamingConfig = @{
        webhook_url = $webhook_url
        enable_logging = $true
        max_duration_seconds = 300
        sample_rate = 24000
        output_format = "mp3_44100"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/convai/configure" -Method Post -Headers $headers -Body $streamingConfig
        Write-Host "✅ Streaming configurado" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error configurando streaming: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Get-VoiceAnalytics {
    Write-Host "📊 Obteniendo analytics de uso..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/user/subscription" -Headers $headers
        
        Write-Host "📈 Estadísticas de uso:" -ForegroundColor Yellow
        Write-Host "   Caracteres usados: $($response.character_count)" -ForegroundColor White
        Write-Host "   Límite mensual: $($response.character_limit)" -ForegroundColor White
        Write-Host "   Porcentaje usado: $([math]::Round(($response.character_count / $response.character_limit) * 100, 2))%" -ForegroundColor White
        Write-Host "   Plan: $($response.tier)" -ForegroundColor White
        Write-Host "   Próxima renovación: $($response.next_invoice_date)" -ForegroundColor White
        
        return $response
    }
    catch {
        Write-Host "❌ Error obteniendo analytics: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Ejecución principal
if (-not (Test-ElevenLabsConnection)) {
    exit 1
}

if ($TestVoices) { 
    Get-AvailableVoices
    Test-VoiceGeneration
}

if ($CreateCustomVoice) { 
    New-DanielaCustomVoice
}

if ($SetupStreaming) { 
    Set-StreamingConfig
}

if ($ConfigureDaniela) {
    Write-Host "👩‍🚀 Configurando voz de Daniela IA..." -ForegroundColor Magenta
    Test-VoiceGeneration -VoiceId $ELEVENLABS_VOICE_ID
    Test-VoiceGeneration -VoiceId $ELEVENLABS_VOICE_ID_ALT
    Get-VoiceAnalytics
}

Write-Host "🎉 ElevenLabs God Mode configurado!" -ForegroundColor Magenta
