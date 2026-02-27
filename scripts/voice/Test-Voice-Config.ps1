# 🧪 Test Voice Configuration - AIGestion
# Script simple para probar ElevenLabs y Vapi

# Configuración manual desde .env
$ELEVENLABS_API_KEY = "6147175e58532829d4f8b906a4b99f1f0cfbffdb7deb150b726efd48318ed54b"
$ELEVENLABS_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"
$VAPI_PRIVATE_KEY = "30d5b0d2-f8f7-4320-939e-a8ef78396fd7"

Write-Host "🎤🤖 Probando configuración de voz..." -ForegroundColor Cyan

# Probar ElevenLabs
Write-Host "🎤 ElevenLabs Test:" -ForegroundColor Yellow
$elevenLabsHeaders = @{
    'xi-api-key' = $ELEVENLABS_API_KEY
    'Content-Type' = 'application/json'
}

try {
    $userResponse = Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/user" -Headers $elevenLabsHeaders
    Write-Host "✅ ElevenLabs OK - Usuario: $($userResponse.subscription.tier)" -ForegroundColor Green
    Write-Host "   Caracteres: $($userResponse.subscription.character_count)/$($userResponse.subscription.character_limit)" -ForegroundColor White
}
catch {
    Write-Host "❌ ElevenLabs Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar Vapi
Write-Host "`n🤖 Vapi Test:" -ForegroundColor Yellow
$vapiHeaders = @{
    'Authorization' = "Bearer $VAPI_PRIVATE_KEY"
    'Content-Type' = 'application/json'
}

try {
    $assistantResponse = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant" -Headers $vapiHeaders
    Write-Host "✅ Vapi OK - Asistentes: $($assistantResponse.Count)" -ForegroundColor Green
    
    if ($assistantResponse.Count -gt 0) {
        Write-Host "   Primer asistente: $($assistantResponse[0].name)" -ForegroundColor White
        Write-Host "   Modelo: $($assistantResponse[0].model)" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ Vapi Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar generación de voz
Write-Host "`n🗣️ Generación de voz test:" -ForegroundColor Yellow
try {
    $text = "Hola soy Daniela IA de AIGestion. Sistema de inteligencia artificial nivel dios."
    $voiceData = @{
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
    
    Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_VOICE_ID" -Method Post -Headers $elevenLabsHeaders -Body $voiceData -OutFile "daniela_test.mp3"
    Write-Host "✅ Voz generada - daniela_test.mp3" -ForegroundColor Green
    Write-Host "   Tamaño: $([math]::Round((Get-Item "daniela_test.mp3").Length / 1KB, 2)) KB" -ForegroundColor White
}
catch {
    Write-Host "❌ Error generando voz: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Configuración de voz completada!" -ForegroundColor Magenta
