# 🚀 Guía de Despliegue en Vercel

## 📋 Resumen

Esta guía documenta cómo desplegar el frontend de AIGestion en Vercel mientras el backend se ejecuta en Cloud Run.

## 🏗️ Arquitectura

```text
┌─────────────────┐         ┌──────────────────┐
│                 │         │                  │
│  Vercel CDN     │────────▶│  Cloud Run       │
│  (Frontend)     │  Proxy  │  (Backend)       │
│                 │◀────────│                  │
└─────────────────┘         └──────────────────┘
      │                            │
      │                            ├─ Socket.IO
      │                            ├─ Telegram Bots
      │                            ├─ Background Workers
      │                            └─ Database/Redis
      │
      ▼
   Usuario
```

**Componentes:**

- **Frontend:** React + Vite desplegado en Vercel
- **Backend:** Express + Socket.IO en Cloud Run
- **Proxy:** Vercel redirige `/api/*` al backend en Cloud Run

## 📝 Archivos Configurados

### 1. `vercel.json` (Root)

Configuración principal de Vercel:

- ✅ Build solo del frontend
- ✅ Headers de seguridad
- ✅ Proxy de API a Cloud Run
- ✅ Rewrites para WebSocket

### 2. `.vercelignore`

Excluye archivos innecesarios del despliegue:

- Backend completo
- Node modules
- Build artifacts
- Archivos de desarrollo

### 3. `frontend/website-epic/.env.production`

Template de variables de entorno para producción.

## 🔧 Configuración en Vercel Dashboard

### Variables de Entorno Requeridas

Navega a tu proyecto en Vercel → Settings → Environment Variables y añade:

```bash
# Supabase (requerido)
VITE_SUPABASE_URL=https://jhvtjyfmgncrrbzqpbkt.supabase.co
VITE_SUPABASE_ANON_KEY=<tu_clave_aqui>

# Backend API (actualizar con tu URL real de Cloud Run)
VITE_API_BASE_URL=https://backend-aigestion.run.app/api

# WebSocket
VITE_WS_URL=wss://backend-aigestion.run.app

# Environment
NODE_ENV=production
```

### Variables Opcionales

```bash
# Voice Services
VITE_ELEVENLABS_API_KEY=<tu_clave>
VITE_VAPI_PUBLIC_KEY=<tu_clave>
VITE_VAPI_PRIVATE_KEY=<tu_clave>

# Twilio
VITE_TWILIO_ACCOUNT_SID=<tu_sid>
VITE_TWILIO_AUTH_TOKEN=<tu_token>

# Monitoring
VITE_SENTRY_DSN=<tu_dsn>
```

## 🔐 Configuración Backend (Cloud Run)

### Variables de Entorno Backend

Asegúrate de que tu backend en Cloud Run tenga configurado:

```bash
# CORS Origins (incluir Vercel)
CORS_ORIGIN=https://aigestion.net,https://www.aigestion.net,https://*.vercel.app,http://localhost:3000
```

### Verificar CORS

El archivo `backend/src/app.ts` ya está configurado para aceptar múltiples orígenes desde la variable `CORS_ORIGIN`.

## 📦 Proceso de Despliegue

### Opción 1: Deploy desde CLI

```bash
# Instalar Vercel CLI si no está instalado
npm install -g vercel

# Login en Vercel
vercel login

# Deploy preview
vercel

# Deploy a producción
vercel --prod
```

### Opción 2: Deploy desde GitHub

1. Conecta tu repositorio a Vercel
2. Cada push a `main` despliega automáticamente
3. Cada PR crea un preview deployment

### Opción 3: Deploy manual desde Dashboard

1. Ve a Vercel Dashboard
2. Click "New Project"
3. Import tu repositorio
4. Vercel detectará automáticamente `vercel.json`
5. Click "Deploy"

## ✅ Checklist de Verificación

Antes de desplegar:

- [ ] Backend desplegado en Cloud Run y accesible
- [ ] Variables de entorno configuradas en Vercel
- [ ] URL del backend actualizada en `VITE_API_BASE_URL`
- [ ] CORS configurado en backend para aceptar dominio de Vercel

Después de desplegar:

- [ ] Frontend carga correctamente
- [ ] API calls funcionan (verificar en Network tab)
- [ ] WebSocket se conecta (si aplicable)
- [ ] No hay errores de CORS en console
- [ ] Lighthouse score > 90

## 🧪 Testing

### Test Local

```bash
cd frontend/website-epic
npm install
npm run build
npm run preview
```

Visita `http://localhost:4173` y verifica que todo funcione.

### Test Backend Connection

```bash
# Health check
curl https://backend-aigestion.run.app/api/v1/health

# Debería retornar: {"status":"healthy","uptime":xxx,"version":"1.0.0"}
```

## 🔍 Troubleshooting

### Error: CORS

**Síntoma:** Error en console: "blocked by CORS policy"

**Solución:**

1. Verifica que `CORS_ORIGIN` en backend incluya tu dominio de Vercel
2. Redespliega el backend si cambiaste la configuración
3. Verifica que el dominio en `CORS_ORIGIN` no tenga trailing slash

### Error: API calls fail

**Síntoma:** Requests a `/api/*` retornan 404

**Solución:**

1. Verifica que la URL del backend en `vercel.json` sea correcta
2. Asegúrate de que el backend esté desplegado y accesible
3. Verifica en Vercel Dashboard → Deployments → Functions logs

### Error: Build fails

**Síntoma:** El build en Vercel falla

**Solución:**

1. Verifica que `frontend/website-epic/package.json` tenga todos los dependencies
2. Revisa los logs en Vercel Dashboard
3. Intenta build local: `cd frontend/website-epic && npm run build`

## 📊 Monitoring

### Vercel Analytics

Vercel proporciona automáticamente:

- Performance metrics
- Real User Monitoring
- Web Vitals

Accede en: Vercel Dashboard → Tu proyecto → Analytics

### Backend Monitoring

El backend tiene su propio monitoring en Cloud Run:

- Logs: Cloud Console → Cloud Run → Logs
- Métricas: Cloud Console → Cloud Run → Metrics

## 🚀 Optimizaciones

### Performance

El frontend ya incluye:

- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Compression
- ✅ CDN caching

### SEO

- ✅ Meta tags configurados
- ✅ Headers de seguridad
- ✅ Sitemap (si aplicable)

## 📚 Referencias

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs en Vercel Dashboard
2. Revisa los logs en Cloud Console (backend)
3. Verifica la configuración de CORS
4. Contacta al equipo de desarrollo
