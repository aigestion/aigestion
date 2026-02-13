# Configuración de Variables de Entorno - Daniela Enhanced Voice Service

## Variables de Entorno Requeridas

### Servicios de IA

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Anthropic Configuration
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here

# Google AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# ElevenLabs Configuration (Voz de Daniela)
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL  # Bella voice (default)
```

### Configuración de Daniela

```bash
# Sistema Prompt para Daniela
DANIELA_SYSTEM_PROMPT="Eres Daniela, una asistente de IA futurista y empática de AIGestion. Tu objetivo es ayudar a los usuarios a entender cómo la IA soberana y la arquitectura de AIGestion pueden transformar sus empresas. Eres profesional, futurista, amable y experta en tecnología. Mantén tus respuestas concisas y claras."

# Vapi Configuration (si se usa Vapi)
VITE_VAPI_PUBLIC_KEY=67c74f53-b26a-4d23-9f5b-91c68e1a6c4b
```

### Google Cloud Services (Speech-to-Text)

```bash
# Google Cloud Speech-to-Text
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

### Configuración de la Aplicación

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
```

## Configuración por Ambiente

### Desarrollo

```bash
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Producción

```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://aigestion.net
CORS_ORIGIN=https://aigestion.net,https://admin.aigestion.net
```

## Instalación y Configuración

### 1. Clonar Variables de Entorno

```bash
cp .env.example .env
```

### 2. Configurar API Keys

Obtén las API keys necesarias:

#### OpenAI

1. Ve a https://platform.openai.com/api-keys
2. Crea una nueva API key
3. Añádela a `OPENAI_API_KEY`

#### Anthropic

1. Ve a https://console.anthropic.com/
2. Crea una nueva API key
3. Añádela a `ANTHROPIC_API_KEY`

#### ElevenLabs

1. Ve a https://elevenlabs.io/app/settings/api-key
2. Crea una nueva API key
3. Añádela a `ELEVENLABS_API_KEY`
4. Configura el voice ID deseado en `ELEVENLABS_VOICE_ID`

#### Google Cloud

1. Crea un proyecto en Google Cloud Console
2. Habilita Speech-to-Text API
3. Crea una service account
4. Descarga el JSON key
5. Configura `GOOGLE_APPLICATION_CREDENTIALS`

### 3. Verificar Configuración

```bash
# Verificar todas las credenciales
curl -X POST http://localhost:5000/api/v1/system/credentials/verify

# Verificar servicio específico
curl -X POST http://localhost:5000/api/v1/enhanced-voice/process \
  -H "Content-Type: application/json" \
  -d '{"text":"Hola Daniela","sessionId":"test","userId":"test"}'
```

## Configuración Frontend

### Variables de Entorno del Frontend

```bash
# .env.local en frontend/apps/website-epic/
VITE_VAPI_PUBLIC_KEY=67c74f53-b26a-4d23-9f5b-91c68e1a6c4b
VITE_ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Configuración de Voz

### Voces Disponibles en ElevenLabs

- `EXAVITQu4vr4xnSDxMaL` - Bella (default)
- `21m00Tcm4TlvDq8ikWAM` - Adam
- `AZnzlk1XvdvUeBnXmlld` - Domi
- `MF3mGyEYCl7XYWbV9V6O` - Elli
- `ErXwobaYiN019PkySvjV` - Emily

### Personalización de Voz

```bash
# Cambiar voz de Daniela
ELEVENLABS_VOICE_ID=MF3mGyEYCl7XYWbV9V6O  # Cambiar a Elli

# Configurar velocidad y tono (si se implementa)
DANIELA_VOICE_SPEED=1.0
DANIELA_VOICE_PITCH=1.0
```

## Monitoreo y Logs

### Logs de Daniela

```bash
# Ver logs del servicio
tail -f logs/daniela.log

# Logs específicos de conversación
grep "EnhancedVoiceService" logs/app.log
```

### Métricas de Rendimiento

```bash
# Ver métricas en tiempo real
curl http://localhost:5000/api/v1/analytics/daniela

# Ver estado del sistema
curl http://localhost:5000/api/v1/health
```

## Seguridad

### Protección de API Keys

1. Nunca commits archivos .env
2. Usa secrets management en producción
3. Rotar API keys regularmente
4. Limitar permisos de service accounts

### Rate Limiting

```bash
# Configurar límites específicos para Daniela
DANIELA_RATE_LIMIT_REQUESTS=30
DANIELA_RATE_LIMIT_WINDOW=60
```

## Troubleshooting

### Problemas Comunes

#### Error: "ElevenLabs API Key inválida"

```bash
# Verificar API key
curl -H "xi-api-key: YOUR_API_KEY" https://api.elevenlabs.io/v1/voices
```

#### Error: "Google Cloud credentials no encontradas"

```bash
# Verificar path de credentials
echo $GOOGLE_APPLICATION_CREDENTIALS
ls -la $GOOGLE_APPLICATION_CREDENTIALS
```

#### Error: "Vapi no inicializado"

```bash
# Verificar configuración frontend
console.log(import.meta.env.VITE_VAPI_PUBLIC_KEY)
```

### Testing

```bash
# Test básico de conversación
curl -X POST http://localhost:5000/api/v1/enhanced-voice/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "text": "Hola Daniela, ¿cómo estás?",
    "sessionId": "test_session",
    "userId": "test_user"
  }'
```

## Deploy

### Docker

```bash
# Build con variables de entorno
docker build --build-arg OPENAI_API_KEY=$OPENAI_API_KEY .

# Run con variables
docker run -e OPENAI_API_KEY=$OPENAI_API_KEY \
           -e ELEVENLABS_API_KEY=$ELEVENLABS_API_KEY \
           -p 5000:5000 \
           aigestion/daniela
```

### Kubernetes

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: daniela-secrets
type: Opaque
data:
  OPENAI_API_KEY: <base64-encoded>
  ELEVENLABS_API_KEY: <base64-encoded>
```

## Actualización de Configuración

Para actualizar la configuración sin reiniciar:

```bash
# Recargar configuración
curl -X POST http://localhost:5000/api/v1/system/reload-config

# Actualizar prompt de Daniela
curl -X PUT http://localhost:5000/api/v1/enhanced-voice/config \
  -H "Content-Type: application/json" \
  -d '{"systemPrompt": "Nuevo prompt para Daniela"}'
```
