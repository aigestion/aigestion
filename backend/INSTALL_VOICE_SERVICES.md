# Instalación de Servicios Open Source para Daniela

## Requisitos Previos

- Python 3.8+
- pip
- Node.js 18+
- ffmpeg (para procesamiento de audio)

## Paso 1: Instalar FFmpeg

### Windows
```bash
# Usando Chocolatey
choco install ffmpeg

# O descargar desde: https://ffmpeg.org/download.html
```

### Linux/Mac
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# Mac
brew install ffmpeg
```

## Paso 2: Instalar Coqui TTS

```bash
# Instalar Coqui TTS
pip install TTS

# Verificar instalación
tts --help

# Listar modelos disponibles
tts --list_models

# Probar con voz española
tts --text "Hola, soy Daniela, tu asistente de IA" \
    --model_name "tts_models/es/css10/vits" \
    --out_path test_daniela.wav
```

## Paso 3: Instalar Whisper

```bash
# Instalar Whisper
pip install openai-whisper

# Verificar instalación
whisper --help

# Probar transcripción
whisper test_daniela.wav --model base --language es
```

## Paso 4: Configurar Backend

```bash
cd backend

# Instalar dependencias de Node.js (si es necesario)
npm install
```

## Paso 5: Actualizar .env

```bash
# Añadir al archivo .env
USE_COQUI_TTS=true
USE_WHISPER_STT=true
WHISPER_MODEL_SIZE=base  # tiny, base, small, medium, large

# Comentar servicios de pago
# ELEVENLABS_API_KEY=
# VAPI_API_KEY=
```

## Paso 6: Probar Servicios

```bash
# Iniciar backend
npm run dev

# Probar endpoint de TTS
curl -X POST http://localhost:5000/api/v1/voice/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hola, soy Daniela"}'

# Probar endpoint de STT
curl -X POST http://localhost:5000/api/v1/voice/stt \
  -F "audio=@test.wav"
```

## Troubleshooting

### Error: "tts: command not found"
```bash
# Verificar que Python scripts están en PATH
python -m pip show TTS

# Usar directamente
python -m TTS.bin.synthesize --text "test" --out_path test.wav
```

### Error: "whisper: command not found"
```bash
# Usar módulo Python directamente
python -c "import whisper; model = whisper.load_model('base'); print('OK')"
```

### Error: "ffmpeg not found"
```bash
# Instalar ffmpeg según tu sistema operativo
# Ver instrucciones arriba
```

## Verificación Final

```bash
# Verificar que todo está instalado
python -c "import TTS; import whisper; print('✅ All dependencies installed')"

# Verificar servicios de Node.js
cd backend
npm run typecheck
```

## Próximos Pasos

1. Integrar servicios en `daniela-enhanced.service.ts`
2. Crear endpoints de API
3. Probar flujo completo de conversación
4. Configurar Pipecat para orquestación (opcional)
5. Configurar Twilio para llamadas telefónicas (cuando tengas cliente)

## Recursos

- Coqui TTS: https://github.com/coqui-ai/TTS
- Whisper: https://github.com/openai/whisper
- Pipecat: https://github.com/pipecat-ai/pipecat
- Twilio: https://www.twilio.com/docs/voice
