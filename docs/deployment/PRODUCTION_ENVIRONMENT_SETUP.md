# 🚀 Configuración de Variables de Entorno Producción - Daniela AI

## 📋 Variables de Entorno Requeridas

### Backend Variables

```bash
# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://aigestion.net
CORS_ORIGIN=https://aigestion.net,https://admin.aigestion.net,https://client.aigestion.net,https://demo.aigestion.net

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aigestion?retryWrites=true&w=majority
REDIS_URL=redis://username:password@redis-12345.c1.us-east-1-2.amazonaws.com:6379

# AI Services
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Voice Services
ELEVENLABS_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
VITE_VAPI_PUBLIC_KEY=67c74f53-b26a-4d23-9f5b-91c68e1a6c4b

# Google Cloud Services
GOOGLE_APPLICATION_CREDENTIALS=./config/service-account.json
GOOGLE_CLOUD_PROJECT_ID=aigestion-production
GOOGLE_CLOUD_STORAGE_BUCKET=aigestion-audio-files

# Daniela Configuration
DANIELA_SYSTEM_PROMPT="Eres Daniela, una asistente de IA futurista y empática de AIGestion. Tu objetivo es ayudar a los usuarios a entender cómo la IA soberana y la arquitectura de AIGestion pueden transformar sus empresas. Eres profesional, futurista, amable y experta en tecnología. Mantén tus respuestas concisas y claras."

# Security
JWT_SECRET=your-super-secret-jwt-key-here-256-bits
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-here

# External Services
STRIPE_SECRET_KEY=sk_live_YourStripeSecretKeyHere
STRIPE_WEBHOOK_SECRET=whsec_YourWebhookSecretHere

# Monitoring
SENTRY_DSN=https://xxxxxxxxxxxxx.ingest.sentry.io/xxxxxxx
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Storage
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=aigestion-production-files

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VERCEL_ANALYTICS_ID=xxxxxxxx-xxxx-xxxx-xxxxxxxx
```

### Frontend Variables (Vercel)

```bash
# Website Epic (Principal)
VITE_API_BASE_URL=https://aigestion-backend.onrender.com/api/v1
VITE_VAPI_PUBLIC_KEY=67c74f53-b26a-4d23-9f5b-91c68e1a6c4b
VITE_ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
VITE_APP_NAME=AIGestion - Daniela AI Assistant
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=production

# Admin Dashboard
VITE_API_BASE_URL=https://aigestion-backend.onrender.com/api/v1
VITE_ADMIN_MODE=true
VITE_DANIELA_ADMIN_ACCESS=true

# Client Dashboard
VITE_API_BASE_URL=https://aigestion-backend.onrender.com/api/v1
VITE_CLIENT_MODE=true

# Demo Dashboard
VITE_API_BASE_URL=https://aigestion-backend.onrender.com/api/v1
VITE_DEMO_MODE=true
```

---

## 🔧 Configuración Paso a Paso

### 1. Configurar Backend

#### Variables de Entorno

```bash
# Copiar template
cp docs/PRODUCTION_ENVIRONMENT_SETUP.md backend/.env.production

# Editar con tus valores reales
nano backend/.env.production
```

#### Actualizar `backend/src/config/env.schema.ts`

```typescript
// Asegurar que todas las variables requeridas estén definidas
const envSchema = z.object({
  NODE_ENV: z.enum(['production']).default('production'),
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string().url(),
  OPENAI_API_KEY: z.string(),
  ELEVENLABS_API_KEY: z.string(),
  // ... otras variables
});
```

### 2. Configurar Frontend

#### Vercel CLI Setup

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login en Vercel
vercel login

# Configurar variables de entorno
cd frontend/apps/website-epic
vercel env add VITE_API_BASE_URL
vercel env add VITE_VAPI_PUBLIC_KEY
vercel env add VITE_ELEVENLABS_VOICE_ID
```

#### Para cada aplicación:

```bash
# Website Epic
cd frontend/apps/website-epic
vercel env add VITE_API_BASE_URL "https://aigestion-backend.onrender.com/api/v1"
vercel env add VITE_VAPI_PUBLIC_KEY "67c74f53-b26a-4d23-9f5b-91c68e1a6c4b"
vercel env add VITE_ELEVENLABS_VOICE_ID "EXAVITQu4vr4xnSDxMaL"

# Admin Dashboard
cd ../admindashboard
vercel env add VITE_API_BASE_URL "https://aigestion-backend.onrender.com/api/v1"
vercel env add VITE_ADMIN_MODE "true"
vercel env add VITE_DANIELA_ADMIN_ACCESS "true"

# Client Dashboard
cd ../clientdashboard
vercel env add VITE_API_BASE_URL "https://aigestion-backend.onrender.com/api/v1"
vercel env add VITE_CLIENT_MODE "true"

# Demo Dashboard
cd ../demodashboard
vercel env add VITE_API_BASE_URL "https://aigestion-backend.onrender.com/api/v1"
vercel env add VITE_DEMO_MODE "true"
```

---

## 🌐 Configuración de Servicios Externos

### OpenAI Configuration

1. Ve a https://platform.openai.com/api-keys
2. Crea nueva API key
3. Copia y pega en `OPENAI_API_KEY`

### Anthropic Configuration

1. Ve a https://console.anthropic.com/
2. Crea nueva API key
3. Copia y pega en `ANTHROPIC_API_KEY`

### Google Cloud Configuration

1. Crea proyecto en Google Cloud Console
2. Habilita APIs:
   - Cloud Speech-to-Text
   - Cloud Text-to-Speech
   - Cloud Storage
3. Crea service account
4. Descarga JSON key
5. Guarda como `service-account.json`

### ElevenLabs Configuration

1. Ve a https://elevenlabs.io/app/settings/api-key
2. Crea nueva API key
3. Copia y pega en `ELEVENLABS_API_KEY`

### MongoDB Atlas Configuration

1. Crea cluster en MongoDB Atlas
2. Configura IP whitelist
3. Copia connection string a `MONGODB_URI`

### Redis Configuration

1. Crea cluster en Redis Cloud
2. Copia connection string a `REDIS_URL`

---

## 🔒 Configuración de Seguridad

### JWT Configuration

```bash
# Generar JWT secret fuerte
openssl rand -base64 32

# Agregar a JWT_SECRET
```

### CORS Configuration

```typescript
// En backend/src/app.ts
app.use(
  cors({
    origin: [
      'https://aigestion.net',
      'https://admin.aigestion.net',
      'https://client.aigestion.net',
      'https://demo.aigestion.net',
    ],
    credentials: true,
  })
);
```

### Rate Limiting

```typescript
// En backend/src/config/rate-limit.config.ts
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: 'Too many requests from this IP',
};
```

---

## 📊 Configuración de Monitoreo

### Sentry Setup

```bash
# Instalar Sentry
npm install @sentry/node

# Configurar DSN
export SENTRY_DSN=https://xxxxxxxxxxxxx.ingest.sentry.io/xxxxxxx
```

### Google Analytics

```bash
# Agregar a frontend
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Configurar en index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

---

## 🚀 Deploy en Producción

### Backend Deploy (Render)

```bash
# Instalar Render CLI
npm install -g @render/cli

# Login
render login

# Crear servicio
render create aigestion-backend

# Configurar variables de entorno
render env set NODE_ENV production
render env set MONGODB_URI $MONGODB_URI
render env set REDIS_URL $REDIS_URL
# ... otras variables

# Deploy
render deploy
```

### Frontend Deploy (Vercel)

```bash
# Deploy Website Epic
cd frontend/apps/website-epic
vercel --prod

# Deploy Admin Dashboard
cd ../admindashboard
vercel --prod --name aigestion-admin

# Deploy Client Dashboard
cd ../clientdashboard
vercel --prod --name aigestion-client

# Deploy Demo Dashboard
cd ../demodashboard
vercel --prod --name aigestion-demo
```

---

## 🌐 Configuración de Dominios

### Vercel Domain Setup

```bash
# Configurar dominio principal
vercel domains add aigestion.net

# Configurar subdominios
vercel domains add admin.aigestion.net
vercel domains add client.aigestion.net
vercel domains add demo.aigestion.net
```

### DNS Configuration

```
# A Record para dominio principal
aigestion.net.     IN  A     76.76.19.19

# CNAME para subdominios
admin.aigestion.net.  IN  CNAME  cname.vercel-dns.com
client.aigestion.net. IN  CNAME  cname.vercel-dns.com
demo.aigestion.net.   IN  CNAME  cname.vercel-dns.com
```

---

## 🔍 Verificación de Configuración

### Backend Health Check

```bash
# Verificar que el backend está corriendo
curl https://aigestion-backend.onrender.com/api/v1/health

# Verificar variables de entorno
curl https://aigestion-backend.onrender.com/api/v1/enhanced-voice/config
```

### Frontend Health Check

```bash
# Verificar que los sitios están activos
curl -I https://aigestion.net
curl -I https://admin.aigestion.net
curl -I https://client.aigestion.net
curl -I https://demo.aigestion.net
```

### API Integration Test

```bash
# Test de integración completa
curl -X POST https://aigestion-backend.onrender.com/api/v1/enhanced-voice/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "sessionId": "test_session",
    "userId": "test_user",
    "text": "Hola Daniela, ¿cómo estás?"
  }'
```

---

## 📋 Checklist Pre-Deploy

### Backend Checklist

- [ ] Variables de entorno configuradas
- [ ] Base de datos conectada
- [ ] Redis conectado
- [ ] APIs de IA configuradas
- [ ] JWT secret configurado
- [ ] CORS configurado
- [ ] Rate limiting configurado
- [ ] Health check funcionando
- [ ] Logs configurados

### Frontend Checklist

- [ ] Variables de entorno configuradas en Vercel
- [ ] Build exitoso
- [ ] Rutas SPA configuradas
- [ ] API proxy funcionando
- [ ] Analytics configurado
- [ ] Error tracking configurado
- [ ] Performance optimizado

### Security Checklist

- [ ] HTTPS habilitado
- [ ] Headers de seguridad configurados
- [ ] API keys seguras
- [ ] Rate limiting activo
- [ ] Input validation implementado
- [ ] SQL injection prevenido
- [ ] XSS protection activa

---

## 🚨 Troubleshooting Común

### Problemas de Variables de Entorno

```bash
# Verificar variables de entorno
echo $NODE_ENV
echo $MONGODB_URI
echo $OPENAI_API_KEY

# Verificar archivo .env
cat .env.production
```

### Problemas de Conexión

```bash
# Verificar conexión a MongoDB
mongosh "$MONGODB_URI" --eval "db.runCommand({ping: 1})"

# Verificar conexión a Redis
redis-cli -u "$REDIS_URL" ping
```

### Problemas de API

```bash
# Verificar API key de OpenAI
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models

# Verificar API key de ElevenLabs
curl -H "xi-api-key: $ELEVENLABS_API_KEY" \
     https://api.elevenlabs.io/v1/voices
```

### Problemas de Frontend

```bash
# Verificar build
npm run build

# Verificar variables de entorno
vercel env ls

# Verificar logs de deploy
vercel logs
```

---

## 📞 Soporte y Monitoreo

### Logs y Monitoreo

- **Backend Logs**: Render dashboard
- **Frontend Logs**: Vercel dashboard
- **Error Tracking**: Sentry dashboard
- **Performance**: Google Analytics
- **API Monitoring**: Custom dashboard

### Alertas Automáticas

- **Uptime Monitoring**: UptimeRobot
- **Error Rate**: Sentry alerts
- **Performance**: Lighthouse CI
- **Security**: Security scan results

---

## 🔄 Mantenimiento Continuo

### Actualizaciones

```bash
# Actualizar dependencias
npm update

# Actualizar seguridad
npm audit fix

# Actualizar dependencias de frontend
pnpm update
```

### Backups

```bash
# Backup de base de datos
mongodump --uri="$MONGODB_URI" --out=backup-$(date +%Y%m%d)

# Backup de configuración
cp .env.production .env.backup-$(date +%Y%m%d)
```

### Monitoreo Continuo

```bash
# Health checks automatizados
curl -f https://aigestion-backend.onrender.com/api/v1/health || echo "Backend down"

# Performance monitoring
curl -f https://aigestion.net || echo "Frontend down"
```

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-24
**Environment**: Production
**Next Review**: 2026-02-24
**Owner**: DevOps Team
