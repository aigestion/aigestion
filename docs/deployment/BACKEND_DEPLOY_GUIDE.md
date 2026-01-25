# 🚀 Guía de Deploy Backend - Render

## 📋 Configuración Completa

### 1. Preparación del Repositorio

#### Archivos Creados
- **`render.yaml`**: Configuración completa del servicio
- **`.env.production`**: Variables de entorno (local)
- **Scripts de build**: Optimizados para producción

#### Estructura del Proyecto
```
backend/
├── src/
│   ├── app.ts              # Entry point
│   ├── config/
│   │   ├── env.schema.ts    # Validación de variables
│   │   └── database.ts      # Configuración BD
│   ├── services/
│   │   ├── enhanced-voice.service.ts
│   │   ├── ai.service.ts
│   │   └── analytics.service.ts
│   └── routes/
│       ├── enhanced-voice.routes.ts
│       └── api-v1.routes.ts
├── render.yaml              # Configuración Render
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## 🔧 Configuración de Variables de Entorno

### Variables Requeridas en Render
```bash
# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://aigestion.net
CORS_ORIGIN=https://aigestion.net,https://admin.aigestion.net,https://client.aigestion.net,https://demo.aigestion.net

# AI Services
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Voice Services
ELEVENLABS_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
VITE_VAPI_PUBLIC_KEY=67c74f53-b26a-4d23-9f5b-91c68e1a6c4b

# Daniela Configuration
DANIELA_SYSTEM_PROMPT="Eres Daniela, una asistente de IA futurista y empática de AIGestion..."

# Security
JWT_SECRET=your-super-secret-jwt-key-here-256-bits
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-here

# Database (Render provides these automatically)
MONGODB_URI=mongodb://aigestion-user:password@mongodb-aigestion.render.com/aigestion
REDIS_URL=redis://redis-aigestion.render.com:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=https://xxxxxxxxxxxxx.ingest.sentry.io/xxxxxxx
```

---

## 🚀 Proceso de Deploy

### Método 1: Web Dashboard (Recomendado)

#### 1. Crear Cuenta Render
1. Ve a https://render.com
2. Crea cuenta o login con GitHub
3. Conecta tu repositorio de GitHub

#### 2. Crear Nuevo Servicio
1. Click "New +" → "Web Service"
2. Selecciona repositorio `AIGestion`
3. Configura servicio:
   - **Name**: `aigestion-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

#### 3. Configurar Variables de Entorno
1. En "Environment" tab, agregar todas las variables
2. **Importantes**:
   - `OPENAI_API_KEY`
   - `ELEVENLABS_API_KEY`
   - `JWT_SECRET`
   - `MONGODB_URI` (si no se usa Render Database)

#### 4. Configurar Database
1. Click "New +" → "PostgreSQL" o "MongoDB"
2. Name: `aigestion-mongodb`
3. Conectar al servicio web

#### 5. Deploy
1. Click "Create Web Service"
2. Esperar build y deploy automático

### Método 2: Render CLI

#### 1. Instalar CLI
```bash
npm install -g @render/cli
```

#### 2. Login
```bash
render login
```

#### 3. Crear Servicio
```bash
# Desde el directorio backend
render create aigestion-backend
```

#### 4. Configurar Variables
```bash
render env set NODE_ENV production
render env set OPENAI_API_KEY $OPENAI_API_KEY
render env set ELEVENLABS_API_KEY $ELEVENLABS_API_KEY
render env set JWT_SECRET $JWT_SECRET
# ... otras variables
```

#### 5. Deploy
```bash
render deploy
```

---

## 🗄️ Configuración de Base de Datos

### MongoDB Atlas (Recomendado)
```bash
# 1. Crear cluster en MongoDB Atlas
# 2. Configurar IP whitelist (0.0.0.0/0 para Render)
# 3. Crear usuario de base de datos
# 4. Copiar connection string

# Connection string format:
mongodb+srv://username:password@cluster.mongodb.net/aigestion?retryWrites=true&w=majority
```

### Render MongoDB
```bash
# Automáticamente configurado si se usa addon
# Variables proporcionadas:
MONGODB_URI=mongodb://aigestion-user:password@mongodb-aigestion.render.com/aigestion
```

### Redis (Render)
```bash
# Automáticamente configurado si se usa addon
REDIS_URL=redis://redis-aigestion.render.com:6379
```

---

## 🔧 Configuración Específica

### Health Check Endpoint
```typescript
// backend/src/routes/health.routes.ts
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      version: '2.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        ai_providers: 'operational'
      }
    }
  });
});
```

### CORS Configuration
```typescript
// backend/src/app.ts
import cors from 'cors';

app.use(cors({
  origin: [
    'https://aigestion.net',
    'https://admin.aigestion.net',
    'https://client.aigestion.net',
    'https://demo.aigestion.net'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
```

### Error Handling
```typescript
// backend/src/middleware/error.middleware.ts
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.name || 'INTERNAL_ERROR',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    meta: {
      requestId: req.headers['x-request-id'] || 'unknown',
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    }
  });
};
```

---

## 📊 Monitoreo y Logs

### Logs Automáticos
```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});
```

### Health Checks
```bash
# Verificar health endpoint
curl https://aigestion-backend.onrender.com/api/v1/health

# Verificar logs
render logs aigestion-backend
```

### Monitoring con Sentry
```bash
# Instalar Sentry
npm install @sentry/node

# Configurar en app.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

---

## 🚨 Troubleshooting Común

### Build Failures
```bash
# Verificar dependencias
npm install
npm audit fix

# Verificar TypeScript
npm run type-check

# Verificar linting
npm run lint
```

### Database Connection Issues
```bash
# Verificar connection string
echo $MONGODB_URI

# Test connection local
mongosh "$MONGODB_URI" --eval "db.runCommand({ping: 1})"
```

### API Key Issues
```bash
# Verificar OpenAI
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models

# Verificar ElevenLabs
curl -H "xi-api-key: $ELEVENLABS_API_KEY" \
     https://api.elevenlabs.io/v1/voices
```

### Performance Issues
```bash
# Verificar memory usage
render logs aigestion-backend --tail

# Verificar response time
curl -w "@curl-format.txt" \
     -o /dev/null \
     -s \
     https://aigestion-backend.onrender.com/api/v1/health
```

---

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/deploy-render.yml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
          env-vars: |
            NODE_ENV=production
            OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }}
            ELEVENLABS_API_KEY=${{ secrets.ELEVENLABS_API_KEY }}
```

### Webhooks
```bash
# Configurar webhook en Render Dashboard
# Settings → Webhooks → Add Webhook
# URL: https://api.github.com/repos/username/AIGestion/hooks
```

---

## 📈 Scaling Configuration

### Auto-scaling
```yaml
# render.yaml
scaling:
  minInstances: 1
  maxInstances: 5
  targetMemoryPercent: 80
  targetCPUUtilization: 70
```

### Performance Optimization
```typescript
// backend/src/config/performance.config.ts
export const performanceConfig = {
  // Connection pooling
  dbPoolSize: 10,
  redisPoolSize: 5,

  // Rate limiting
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100,

  // Cache settings
  cacheTTL: 300, // 5 minutes

  // Timeout settings
  requestTimeout: 30000, // 30 seconds
  dbTimeout: 10000 // 10 seconds
};
```

---

## 🔒 Security Best Practices

### Environment Variables
```bash
# Usar secrets de Render para valores sensibles
render env set JWT_SECRET --secret
render env set OPENAI_API_KEY --secret
render env set ELEVENLABS_API_KEY --secret
```

### API Security
```typescript
// Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### Database Security
```bash
# Usar connection strings con usuarios específicos
# Limitar IP whitelist en MongoDB Atlas
# Usar SSL/TLS para todas las conexiones
```

---

## 📋 Checklist Pre-Deploy

### ✅ Code Ready
- [ ] Tests passing locally
- [ ] TypeScript compilation successful
- [ ] Linting no errors
- [ ] Environment variables configured
- [ ] Health check endpoint working

### ✅ Infrastructure Ready
- [ ] Render account configured
- [ ] Database created and connected
- [ ] Redis cache configured
- [ ] Environment variables set in Render
- [ ] Custom domains configured (if needed)

### ✅ Security Ready
- [ ] API keys stored as secrets
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Error handling in place
- [ ] Logging configured

---

## 🚀 Deploy Commands

### Quick Deploy
```bash
# Deploy desde directorio backend
render deploy

# Deploy con force
render deploy --force

# Verificar status
render ps

# Ver logs
render logs aigestion-backend --tail
```

### Rollback
```bash
# Verificar deploys anteriores
render deploys

# Rollback a deploy específico
render rollback <deploy-id>
```

---

## 📞 Soporte y Monitoreo

### Render Dashboard
- **URL**: https://dashboard.render.com
- **Logs**: Available in service dashboard
- **Metrics**: Built-in monitoring
- **Alerts**: Configurable email notifications

### External Monitoring
```bash
# Uptime monitoring
curl -f https://aigestion-backend.onrender.com/api/v1/health

# Performance monitoring
curl -w "@curl-format.txt" \
     -o /dev/null \
     -s \
     https://aigestion-backend.onrender.com/api/v1/health
```

---

## 🎉 Post-Deploy Verification

### Health Check
```bash
curl -I https://aigestion-backend.onrender.com/api/v1/health
```

### API Integration Test
```bash
curl -X POST https://aigestion-backend.onrender.com/api/v1/enhanced-voice/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "sessionId": "test_session",
    "userId": "test_user",
    "text": "Hola Daniela, ¿cómo estás?"
  }'
```

### Frontend Integration
```bash
# Verificar que frontend puede conectar al backend
curl -I https://aigestion.net/api/v1/health
```

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-24
**Platform**: Render
**Status**: Ready for Production Deploy
