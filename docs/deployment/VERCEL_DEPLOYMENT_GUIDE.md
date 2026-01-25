# Guía Completa de Deploy en Vercel - AIGestion Frontend

## 🚀 Configuración Completa para Deploy Producción

### Estructura de Aplicaciones
- **Website Epic**: Aplicación principal con Daniela AI Demo
- **Admin Dashboard**: Panel administrativo con control de Daniela
- **Client Dashboard**: Dashboard para clientes
- **Demo Dashboard**: Dashboard de demostración

## ⚙️ Configuración de Variables de Entorno Vercel

### Variables Globales (para todas las apps)
```bash
VITE_API_BASE_URL=https://aigestion-backend.onrender.com/api/v1
VITE_APP_NAME=AIGestion - Daniela AI Assistant
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=production
```

### Variables Específicas Website Epic
```bash
VITE_VAPI_PUBLIC_KEY=67c74f53-b26a-4d23-9f5b-91c68e1a6c4b
VITE_ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```

### Variables Específicas Admin Dashboard
```bash
VITE_ADMIN_MODE=true
VITE_DANIELA_ADMIN_ACCESS=true
```

## 🌐 URLs de Producción

### Aplicaciones Desplegadas
- **Principal**: `https://aigestion.net`
- **Daniela Demo**: `https://aigestion.net/daniela`
- **Admin**: `https://admin.aigestion.net`
- **Client**: `https://client.aigestion.net`
- **Demo**: `https://demo.aigestion.net`

### Rutas Especiales
- **Daniela Demo**: `/daniela` y `/daniela/demo`
- **Admin Panel**: `/admin` (subdominio dedicado)
- **Client Dashboard**: `/client` (subdominio dedicado)

## 🔧 Configuración de Build

### Scripts Actualizados
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "vercel-build": "tsc -b && vite build",
    "build:production": "NODE_ENV=production vite build",
    "preview": "vite preview"
  }
}
```

### Configuración Vercel.json
Cada aplicación tiene su propio `vercel.json` con:
- **Build Command**: `pnpm run vercel-build`
- **Output Directory**: `dist`
- **Framework**: `vite`
- **Routes**: Configuradas para SPA y API proxy
- **Headers**: Seguridad y cache optimizados
- **Environment**: Variables de producción

## 🛡️ Configuración de Seguridad

### Headers de Seguridad
```json
{
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
    },
    {
      "key": "Referrer-Policy",
      "value": "strict-origin-when-cross-origin"
    }
  ]
}
```

### Cache Optimization
```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 🔄 API Proxy Configuration

### Backend Proxy
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://aigestion-backend.onrender.com/api/$1",
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization"
      }
    }
  ]
}
```

## 📱 Rutas SPA Configuration

### Website Epic Routes
```json
{
  "routes": [
    {
      "src": "/daniela",
      "dest": "/index.html"
    },
    {
      "src": "/daniela/demo",
      "dest": "/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Admin Dashboard Routes
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🎯 Integración de Daniela AI

### Componentes Integrados
1. **DanielaConversationPanel**: Panel conversacional completo
2. **DanielaDemo**: Página de demostración con múltiples modos
3. **DanielaWidget**: Widget flotante para cualquier sitio
4. **AdminDanielaPanel**: Panel administrativo avanzado

### Rutas Especiales
- `/daniela`: Demo principal de Daniela
- `/daniela/demo`: Demo alternativa
- `/admin`: Panel administrativo con control de Daniela

## 🚀 Proceso de Deploy

### 1. Configurar Repositorio
```bash
# Conectar repositorio a Vercel
vercel link

# Configurar variables de entorno
vercel env add VITE_API_BASE_URL
vercel env add VITE_VAPI_PUBLIC_KEY
vercel env add VITE_ELEVENLABS_VOICE_ID
```

### 2. Deploy Individual
```bash
# Deploy website epic
cd frontend/apps/website-epic
vercel --prod

# Deploy admin dashboard
cd ../admindashboard
vercel --prod

# Deploy client dashboard
cd ../clientdashboard
vercel --prod

# Deploy demo dashboard
cd ../demodashboard
vercel --prod
```

### 3. Configurar Dominios
```bash
# Configurar dominios personalizados
vercel domains add aigestion.net
vercel domains add admin.aigestion.net
vercel domains add client.aigestion.net
vercel domains add demo.aigestion.net
```

## 📊 Monitoreo y Analytics

### Vercel Analytics
- **Website Epic**: Analytics completo con tracking de Daniela
- **Admin Dashboard**: Analytics de uso administrativo
- **Client Dashboard**: Analytics de clientes
- **Demo Dashboard**: Analytics de demostraciones

### Speed Insights
- Monitoreo de rendimiento en tiempo real
- Optimización automática de Core Web Vitals
- Análisis de experiencia de usuario

## 🔍 Testing Post-Deploy

### Checklist de Verificación
- [ ] Website principal carga correctamente
- [ ] Ruta `/daniela` funciona
- [ ] Demo de Daniela interactiva
- [ ] Admin dashboard accesible
- [ ] Client dashboard funcional
- [ ] API proxy funcionando
- [ ] Variables de entorno cargadas
- [ ] Headers de seguridad activos
- [ ] Cache configurado
- [ ] Analytics tracking activo

### Tests Automatizados
```bash
# Test de endpoints
curl https://aigestion.net/api/v1/health

# Test de Daniela demo
curl https://aigestion.net/daniela

# Test de admin
curl https://admin.aigestion.net
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Build Failures
```bash
# Verificar dependencias
pnpm install

# Limpiar cache
pnpm run clean

# Rebuild
pnpm run build:production
```

#### 2. Variables de Entorno
```bash
# Verificar variables
vercel env ls

# Pull variables locales
vercel env pull .env.production
```

#### 3. Routes Issues
```bash
# Verificar configuración de routes
cat vercel.json

# Test de rutas
vercel dev
```

#### 4. API Connection
```bash
# Test backend connection
curl -I https://aigestion-backend.onrender.com/api/v1/health

# Verificar CORS
curl -H "Origin: https://aigestion.net" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://aigestion-backend.onrender.com/api/v1/test
```

## 📈 Optimización de Rendimiento

### Build Optimization
```json
{
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

### Bundle Analysis
```bash
# Analizar bundle
pnpm run build --analyze

# Optimizar dependencias
pnpm audit
pnpm audit fix
```

### Image Optimization
- Usar WebP format
- Lazy loading
- Responsive images
- CDN optimization

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🎉 Post-Deploy Celebration

### Verificación Final
1. ✅ Todas las aplicaciones desplegadas
2. ✅ Daniela AI funcional
3. ✅ Analytics configurados
4. ✅ Seguridad implementada
5. ✅ Performance optimizado

### Comunicación
- Anunciar deploy en equipo
- Documentar cambios
- Monitorear primeros días
- Recopilar feedback

---

**Estado**: ✅ Ready for Production Deploy
**Fecha**: 2026-01-24
**Versión**: 2.0.0
**Features**: Daniela AI Futurista Experience
