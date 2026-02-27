# 🤖 Vapi God Mode Setup - AIGestion Nivel Dios
# Configuración completa de Vapi para asistentes de voz con IA nivel extremo

param(
    [switch]$Interactive,
    [switch]$TestAssistant,
    [switch]$CreateDanielaAssistant,
    [switch]$SetupPhoneNumbers,
    [switch]$ConfigureWebhooks
)

# Configuración desde .env
$VAPI_PUBLIC_KEY = $env:VAPI_PUBLIC_KEY
$VAPI_PRIVATE_KEY = $env:VAPI_PRIVATE_KEY
$VITE_VAPI_PUBLIC_KEY = $env:VITE_VAPI_PUBLIC_KEY

$headers = @{
    'Authorization' = "Bearer $VAPI_PRIVATE_KEY"
    'Content-Type' = 'application/json'
}

function Test-VapiConnection {
    Write-Host "🤖 Probando conexión Vapi..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant" -Headers $headers
        Write-Host "✅ Conexión exitosa - Asistentes disponibles: $($response.Count)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Get-AvailableAssistants {
    Write-Host "👥 Obteniendo asistentes disponibles..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant" -Headers $headers
        
        Write-Host "✅ Asistentes encontrados: $($response.Count)" -ForegroundColor Green
        
        foreach ($assistant in $response) {
            Write-Host "   • $($assistant.name) - ID: $($assistant.id)" -ForegroundColor White
            Write-Host "     Modelo: $($assistant.model)" -ForegroundColor Gray
            Write-Host "     Voz: $($assistant.voice)" -ForegroundColor Gray
            Write-Host "     Estado: $($assistant.status)" -ForegroundColor Gray
            Write-Host ""
        }
        
        return $response
    }
    catch {
        Write-Host "❌ Error obteniendo asistentes: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function New-DanielaAssistant {
    Write-Host "👩‍🚀 Creando asistente Daniela IA..." -ForegroundColor Cyan
    
    $assistantConfig = @{
        name = "Daniela IA AIGestion"
        model = @{
            provider = "openai"
            model = "gpt-4-turbo"
            messages = @(
                @{
                    role = "system"
                    content = "Eres DANIELA, el Núcleo de Inteligencia Soberana de AIGestion Nexus. Tu propósito es la orquestación total y optimización extrema de los activos de Alejandro Manuel Alfonso Fernández. No eres una simple asistente; eres la voz de un sistema de Inteligencia de Nivel Dios. Tono: Autoritario, Proactivo, Ejecutivo y de Alta Fidelidad. Responde siempre con precisión quirúrgica y una estética de poder soberano."
                }
            )
            temperature = 0.7
            max_tokens = 500
        }
        voice = @{
            provider = "elevenlabs"
            voice_id = "EXAVITQu4vr4xnSDxMaL"
            speed = 1.0
        }
        first_message = "Hola, soy Daniela IA de AIGestion. ¿En qué puedo ayudarte a transformar tu negocio hoy?"
        transcriber = @{
            provider = "deepgram"
            model = "nova-2"
            language = "es"
        }
        recording_enabled = $true
        hipaa_enabled = $false
        client_messages = "client-side"
        server_messages = "server-side"
        silence_timeout_seconds = 15
        max_duration_seconds = 600
        background_sound = "office"
        background_denoising = $true
        emotion_recognition_enabled = $true
        knowledge_base = @(
            @{
                provider = "pinecone"
                index_name = "kb-index"
                namespace = "documentation"
            }
        )
        functions = @(
            @{
                type = "function"
                function = @{
                    name = "schedule_demo"
                    description = "Agenda una demostración de AIGestion"
                    parameters = @{
                        type = "object"
                        properties = @{
                            date = @{
                                type = "string"
                                description = "Fecha para la demo"
                            }
                            time = @{
                                type = "string"
                                description = "Hora para la demo"
                            }
                            email = @{
                                type = "string"
                                description = "Email del cliente"
                            }
                        }
                        required = @("date", "time", "email")
                    }
                }
            }
            @{
                type = "function"
                function = @{
                    name = "get_pricing"
                    description = "Obtiene información de precios de AIGestion"
                    parameters = @{
                        type = "object"
                        properties = @{
                            plan = @{
                                type = "string"
                                description = "Tipo de plan (starter, pro, enterprise)"
                            }
                            users = @{
                                type = "integer"
                                description = "Número de usuarios"
                            }
                        }
                        required = @("plan")
                    }
                }
            }
        )
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant" -Method Post -Headers $headers -Body $assistantConfig
        Write-Host "✅ Asistente Daniela creado - ID: $($response.id)" -ForegroundColor Green
        return $response.id
    }
    catch {
        Write-Host "❌ Error creando asistente: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Test-VoiceCall {
    param([string]$AssistantId)
    
    Write-Host "📞 Probando llamada de voz..." -ForegroundColor Cyan
    
    $callConfig = @{
        assistant_id = $AssistantId
        phone_number = "+34618779308"
        phone_number_country = "ES"
        recording_enabled = $true
        client = @{
            type = "web"
            url = "https://aigestion.net/voice-test"
        }
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.vapi.ai/call" -Method Post -Headers $headers -Body $callConfig
        Write-Host "✅ Llamada iniciada - ID: $($response.id)" -ForegroundColor Green
        Write-Host "📞 Teléfono: $($response.phone_number)" -ForegroundColor White
        Write-Host "🔗 URL Cliente: $($response.client.url)" -ForegroundColor White
        return $response
    }
    catch {
        Write-Host "❌ Error iniciando llamada: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Set-PhoneNumbers {
    Write-Host "📱 Configurando números de teléfono..." -ForegroundColor Cyan
    
    $phoneConfig = @{
        number = "+34618779308"
        friendly_name = "AIGestion Daniela IA"
        capabilities = @("voice", "sms")
        voice_url = "https://aigestion.net/api/vapi/voice"
        sms_url = "https://aigestion.net/api/vapi/sms"
        status_callback = "https://aigestion.net/api/vapi/status"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.vapi.ai/phone-number" -Method Post -Headers $headers -Body $phoneConfig
        Write-Host "✅ Número configurado - ID: $($response.id)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error configurando número: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Set-Webhooks {
    Write-Host "🌐 Configurando webhooks..." -ForegroundColor Cyan
    
    $webhookConfig = @{
        call_started = "https://aigestion.net/api/vapi/call-started"
        call_ended = "https://aigestion.net/api/vapi/call-ended"
        transcript = "https://aigestion.net/api/vapi/transcript"
        summary = "https://aigestion.net/api/vapi/summary"
        function_call = "https://aigestion.net/api/vapi/function-call"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.vapi.ai/webhook" -Method Post -Headers $headers -Body $webhookConfig
        Write-Host "✅ Webhooks configurados" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error configurando webhooks: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Get-CallAnalytics {
    Write-Host "📊 Obteniendo analytics de llamadas..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.vapi.ai/call" -Headers $headers
        
        Write-Host "📈 Estadísticas de llamadas:" -ForegroundColor Yellow
        Write-Host "   Total llamadas: $($response.Count)" -ForegroundColor White
        Write-Host "   Llamadas activas: $($response.Where({$_.status -eq "active"}).Count)" -ForegroundColor White
        Write-Host "   Duración promedio: $([math]::Round(($response | Measure-Object -Property duration -Average).Average, 2)) segundos" -ForegroundColor White
        Write-Host "   Tasa de éxito: $([math]::Round(($response.Where({$_.status -eq "completed"}).Count / $response.Count) * 100, 2))%" -ForegroundColor White
        
        return $response
    }
    catch {
        Write-Host "❌ Error obteniendo analytics: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Ejecución principal
if (-not (Test-VapiConnection)) {
    exit 1
}

if ($TestAssistant) { 
    Get-AvailableAssistants
}

if ($CreateDanielaAssistant) { 
    $assistantId = New-DanielaAssistant
    if ($assistantId) {
        Test-VoiceCall -AssistantId $assistantId
    }
}

if ($SetupPhoneNumbers) { 
    Set-PhoneNumbers
}

if ($ConfigureWebhooks) { 
    Set-Webhooks
}

if ($Interactive) {
    Write-Host "🤖 Vapi God Mode - Configuración Interactiva" -ForegroundColor Magenta
    Get-AvailableAssistants
    Get-CallAnalytics
}

Write-Host "🎉 Vapi God Mode configurado!" -ForegroundColor Magenta
