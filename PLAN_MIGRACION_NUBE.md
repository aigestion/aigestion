# 🌩️ PLAN MIGRACIÓN NUBE - AIGESTION
**Fecha:** 16 de Febrero de 2026  
**Estado:** CRÍTICO - MIGRACIÓN INMEDIATA REQUERIDA

---

## 🎯 **OBJETIVO PRINCIPAL**

Transformar AIGestion de arquitectura local a **100% serverless** en la nube para:
- Eliminar carga del miniPC (CPU 93% → <20%)
- Permitir desarrollo escalable
- Reducir costos operativos
- Mejorar rendimiento global

---

## 📋 **FASES DE MIGRACIÓN**

### 🚀 **FASE 1: SERVICIOS ESENCIALES (HOY - 24 HORAS)**

#### **1.1 Base de Datos - MongoDB Atlas**
```bash
# Acción inmediata
1. Crear cuenta MongoDB Atlas (gratuito M0)
2. Crear cluster: us-east-1 (más cercano)
3. Configurar whitelist IP: 0.0.0.0/0 (temporal)
4. Obtener connection string
5. Actualizar .env con MONGODB_URI
```

**Connection String:**
```
MONGODB_URI=mongodb+srv://aigestion:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### **1.2 Cache - Redis Cloud**
```bash
# Alternativa: Upstash Redis (más fácil)
1. Crear cuenta Upstash (gratis 10K commands/day)
2. Crear Redis database
3. Obtener Redis URL
4. Actualizar .env
```

**Redis URL:**
```
REDIS_URL=redis://default:<password>@xxx.upstash.io:6380
```

#### **1.3 Frontend - Vercel (Ya listo)**
✅ **COMPLETADO** - https://aigestion.net ya está en Vercel

#### **1.4 Backend - Railway**
```bash
1. Crear cuenta Railway
2. Conectar GitHub repo
3. Configurar variables entorno
4. Deploy automático
```

---

### ⚡ **FASE 2: AUTOMATIZACIÓN (MAÑANA - 48 HORAS)**

#### **2.1 CI/CD - GitHub Actions**
```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
```

#### **2.2 Environment Variables Management**
```bash
# GitHub Secrets (Configurar en repo settings)
RAILWAY_TOKEN=xxx
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
JWT_SECRET=xxx
GEMINI_API_KEY=xxx
```

#### **2.3 Testing Automatizado**
```bash
# GitHub Actions para tests
name: Test Backend
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
```

---

### 🌟 **FASE 3: ARQUITECTURA SERVERLESS (1 SEMANA)**

#### **3.1 API Functions - Vercel Functions**
```javascript
// api/users.js
import { connectToDatabase } from '../../lib/mongodb';
import { verifyAuth } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  
  const user = await verifyAuth(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  const db = await connectToDatabase();
  const users = await db.collection('users').find({}).toArray();
  
  res.status(200).json(users);
}
```

#### **3.2 Auth - Supabase Auth (Ya configurado)**
✅ **COMPLETADO** - Supabase ya está configurado

#### **3.3 Storage - Cloudflare R2**
```bash
# Para archivos estáticos y assets
1. Crear cuenta Cloudflare R2
2. Crear bucket: aigestion-assets
3. Subir imágenes y archivos estáticos
4. Configurar CDN
```

---

## 🛠️ **CONFIGURACIÓN DETALLADA**

### **MongoDB Atlas Setup**
```bash
# 1. Registro: https://www.mongodb.com/cloud/atlas/register
# 2. Crear cluster M0 (gratuito)
# 3. Configurar network access:
#    - Add IP Address: 0.0.0.0/0 (temporal para desarrollo)
#    - Add Current IP Address (para producción)
# 4. Database user:
#    - Username: aigestion
#    - Password: generar contraseña segura
# 5. Connection string:
mongodb+srv://aigestion:<PASSWORD>@cluster0.xxxxx.mongodb.net/aigestion?retryWrites=true&w=majority
```

### **Railway Backend Setup**
```bash
# 1. Registro: https://railway.app/
# 2. New Project → Deploy from GitHub
# 3. Seleccionar repo: AIGestion/backend
# 4. Configurar variables:
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
JWT_SECRET=xxx
# 5. Deploy automático
```

### **Upstash Redis Setup**
```bash
# 1. Registro: https://upstash.com/
# 2. Create Redis Database
# 3. Region: us-east-1 (misma que MongoDB)
# 4. Obtener REST URL y REST Token
# 5. Configurar en backend
```

---

## 📊 **COSTOS ESTIMADOS**

### **Plan Gratuito (0€/mes)**
- **MongoDB Atlas M0:** 512MB storage
- **Upstash Redis:** 10K commands/day
- **Vercel Pro:** $0/personal projects
- **Railway:** $0/first 500 hours
- **GitHub Actions:** 2000 minutes/month

### **Plan Growth (~20€/mes)**
- **MongoDB Atlas M10:** $25/mes (si necesita más)
- **Upstash Redis Pro:** $5/mes
- **Vercel Pro:** $20/mes (si necesita bandwidth extra)
- **Railway:** $5-20/mes (depende uso)

---

## 🔄 **MIGRACIÓN PASO A PASO**

### **HOY - EMERGENCIA (2 horas)**
```bash
# 1. MongoDB Atlas
- Crear cuenta y cluster (30 min)
- Obtener connection string (10 min)
- Actualizar .env (5 min)
- Test conexión (15 min)

# 2. Redis Upstash
- Crear cuenta y database (20 min)
- Obtener URL (5 min)
- Actualizar .env (5 min)
- Test conexión (10 min)

# 3. Railway Deploy
- Conectar GitHub repo (15 min)
- Configurar variables (10 min)
- Deploy inicial (20 min)
- Test endpoints (20 min)
```

### **MAÑANA - OPTIMIZACIÓN (4 horas)**
```bash
# 1. GitHub Actions CI/CD
- Configurar workflows (1 hora)
- Setup secrets (30 min)
- Test automático (30 min)

# 2. Environment Management
- Migrar .env a GitHub secrets (1 hora)
- Configurar staging/production (1 hora)

# 3. Testing y Validación
- Test completo sistema (1 hora)
- Performance testing (30 min)
```

### **ESTA SEMANA - SERVERLESS (8 horas)**
```bash
# 1. Vercel Functions
- Migrar endpoints críticos (4 horas)
- Configurar middleware (2 horas)
- Testing integración (2 horas)

# 2. Storage y CDN
- Configurar Cloudflare R2 (2 horas)
- Migrar assets (2 horas)
- Configurar CDN (2 horas)

# 3. Monitorización
- Setup logs y métricas (2 horas)
- Configurar alertas (1 hora)
- Documentación (1 hora)
```

---

## 🎯 **BENEFICIOS ESPERADOS**

### **Inmediatos (24 horas)**
- **CPU local:** 93% → <20%
- **RAM libre:** 26% → >70%
- **Build time:** 30s → 10s (cloud)
- **Desarrollo:** Sin dependencias locales

### **Corto plazo (1 semana)**
- **Escalabilidad:** Infinita
- **Disponibilidad:** 99.9%
- **Costos:** Predecibles
- **Mantenimiento:** Mínimo

### **Largo plazo (1 mes)**
- **Productividad:** +200%
- **Colaboración:** Multi-desarrollador
- **Innovación:** Serverless architecture
- **Crecimiento:** Sostenible

---

## 🚨 **RIESGOS Y MITIGACIÓN**

### **Riesgos Críticos**
1. **Downtime durante migración**
   - **Mitigación:** Blue-green deployment
   - **Backup:** Mantener local hasta validar

2. **Pérdida de datos**
   - **Mitigación:** Backup completo MongoDB local
   - **Validación:** Test completo antes de corte

3. **Costos inesperados**
   - **Mitigación:** Plan gratuito inicial
   - **Monitorización:** Alertas de uso

### **Riesgos Medios**
1. **Performance inicial**
   - **Mitigación:** CDN y caching
   - **Optimization:** Progressive enhancement

2. **Complejidad técnica**
   - **Mitigación:** Documentación completa
   - **Training:** Tutoriales y guías

---

## 📞 **EJECUCIÓN INMEDIATA**

### **Prioridad 1 - HOY**
1. ✅ **Detener servicios locales** (completado)
2. 🔄 **MongoDB Atlas setup** (en progreso)
3. ⏳ **Redis Upstash setup** (pendiente)
4. ⏳ **Railway deploy** (pendiente)

### **Prioridad 2 - MAÑANA**
1. ⏳ **GitHub Actions CI/CD**
2. ⏳ **Environment management**
3. ⏳ **Testing automatizado**

### **Prioridad 3 - ESTA SEMANA**
1. ⏳ **Vercel Functions**
2. ⏳ **Cloudflare R2 storage**
3. ⏳ **Monitorización y alertas**

---

## 🎉 **CONCLUSIÓN**

La migración a la nube es **urgente y necesaria** para la supervivencia del proyecto. Con el plan detallado, podemos completar la transición en **24-48 horas** y tener un sistema **100% funcional y escalable**.

**Estado actual:** PC recuperado (CPU 74% → 20% esperado)  
**Próximo paso:** Configurar MongoDB Atlas inmediatamente

**Éxito garantizado** con seguimiento del plan y ejecución disciplinada.
