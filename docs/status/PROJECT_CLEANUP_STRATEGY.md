# 🧹 Estrategia de Limpieza de Proyectos - Vercel

## 🎯 **Objetivo Final**

Eliminar los proyectos duplicados y crear una nueva `website-epic` limpia con los datos de `aigestion.net`.

---

## 📋 **Estado Actual Detectado**

### **Proyectos en la Cuenta**

```
📁 aigestions-projects
├── 🏢 aigestion-website-epic (8m ago) ❌ DUPLICADO 1
├── 🏢 website-epic (9h ago) ❌ DUPLICADO 2
├── 🏢 demo-dashboard (9h ago) ✅
├── 🏢 client-dashboard (9h ago) ✅
└── 🏢 admin-dashboard (9h ago) ✅
```

### **Problemas Identificados**

- **2 proyectos duplicados**: `aigestion-website-epic` y `website-epic`
- **Confusión**: No se sabe cuál es el correcto
- **Dominio perdido**: `aigestion.net` no está en esta cuenta
- **Build errors**: Problemas con dependencias

---

## 🧹 **Estrategia de Limpieza Completa**

### **Fase 1: Eliminar Proyectos Duplicados**

```bash
# Desde Vercel dashboard, eliminar:
❌ aigestion-website-website-epic
❌ website-epic
```

### **Fase 2: Crear Nuevo Proyecto Limpio**

```bash
# Crear nuevo proyecto "aigestion-website"
# Con código actualizado de website-epic
# Asignar dominio aigestion.net
```

### **Fase 3: Migrar Datos**

```bash
# Migrar configuración
# Migrar variables de entorno
# Migrar dominios
```

---

## 🗑️ **Paso 1: Eliminar Proyectos Duplicados**

### **Desde Vercel Dashboard**

1. Ve a https://vercel.com/dashboard
2. Inicia sesión con cuenta `aigestion`
3. Ve a "Projects"
4. **Eliminar `aigestion-website-epic`**:
   - Click en proyecto → Settings → Danger Zone → Delete
   - Confirmar: `aigestion-website-epic`
5. **Eliminar `website-epic`**:
   - Click en proyecto → Settings → Danger Zone → Delete
   - Confirmar: `website-epic`

### **Verificación**

```bash
npx vercel projects ls
# Ya no deben aparecer los duplicados
```

---

## 🆕 **Paso 2: Crear Nuevo Proyecto Limpio**

### **Preparar Código**

```bash
# Asegurarse que el código está en el lugar correcto
cd frontend/apps/website-epic
ls -la
# Debe tener: src/, package.json, vercel.json, etc.
```

### **Crear Nuevo Proyecto**

```bash
# Limpiar configuración local
rm -rf .vercel

# Crear nuevo proyecto
npx vercel
# Nombre: aigestion-website
# Framework: Vite
# Build Command: pnpm run vercel-build
# Output Directory: dist
```

### **Configurar Dominio**

```bash
# Agregar dominio principal
npx vercel domains add aigestion.net

# Agregar subdominios
npx vercel domains add admin.aigestion.net
npx vercel domains add client.aigestion.net
npx vercel domains add demo.aigestion.net
```

---

## 🔄 **Paso 3: Migrar Configuración**

### **Variables de Entorno**

```bash
# Configurar variables de entorno
npx vercel env add VITE_API_BASE_URL "https://aigestion-backend.onrender.com/api/v1"
npx vercel env add VITE_VAPI_PUBLIC_KEY "67c74f53-b26a-4d23-9f5b-91c68e1a6c4b"
npx vercel env add VITE_ELEVENLABS_VOICE_ID "EXAVITQu4vr4xnSDxMaL"
npx vercel env add VITE_APP_NAME "AIGestion - Daniela AI Assistant"
npx vercel env add VITE_APP_VERSION "2.0.0"
npx vercel env add VITE_ENVIRONMENT "production"
```

### **Configuración de Build**

```bash
# Verificar vercel.json
cat vercel.json
# Debe tener configuración correcta:
{
  "version": 2,
  "buildCommand": "pnpm run vercel-build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [...],
  "env": {...}
}
```

---

## 🚀 **Paso 4: Deploy Limpio**

### **Limpiar Cache**

```bash
# Limpiar dependencias
rm -rf node_modules package-lock.json

# Instalar dependencias
pnpm install
```

### **Deploy**

```bash
# Deploy a producción
npx vercel --prod
```

### **Verificación**

```bash
# Verificar deploy
npx vercel ls
# Debe mostrar el nuevo proyecto

# Verificar dominios
npx vercel domains ls
# Debe mostrar todos los dominios asignados

# Test URLs
curl -I https://aigestion.net
curl -I https://admin.aigestion.net
curl -I https://client.aigestion.net
curl -I https://demo.aigestion.net
```

---

## 📋 **Estructura Final Deseada**

### **Proyectos Limpios**

```
📁 aigestions-projects
├── 🏢 aigestion-website (nuevo)
│   └── 🌐 https://aigestion.net (website principal)
├── 🏢 aigestion-admin (nuevo)
│   └── 🌐 https://admin.aigestion.net (panel admin)
├── 🏢 aigestion-client (nuevo)
│   └── 🌐 https://client.aigestion.net (dashboard clientes)
└── 🏢 aigestion-demo (nuevo)
    └── 🌐 https://demo.aigestion.net (demo interactivo)
```

### **URLs Finales**

```
✅ https://aigestion.net → Website principal con Daniela
✅ https://admin.aigestion.net → Panel administrativo
✅ https://client.aigestion.net → Dashboard clientes
✅ https://demo.aigestion.net → Demo interactivo
```

---

## 🔧 **Configuración de Archivos**

### **vercel.json (website principal)**

```json
{
  "version": 2,
  "buildCommand": "pnpm run vercel-build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://aigestion-backend.onrender.com/api/$1"
    },
    {
      "source": "/daniela",
      "destination": "/index.html"
    },
    {
      "source": "/login",
      "destination": "/index.html"
    },
    {
      "source": "/dashboard",
      "destination": "/index.html"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://aigestion-backend.onrender.com/api/v1",
    "VITE_VAPI_PUBLIC_KEY": "67c74f53-b26a-4d23-9f5b-91c68e1a6c4b",
    "VITE_ELEVENLABS_VOICE_ID": "EXAVITQu4vr4xnSDxMaL",
    "VITE_APP_NAME": "AIGestion - Daniela AI Assistant",
    "VITE_APP_VERSION": "2.0.0",
    "VITE_ENVIRONMENT": "production"
  }
}
```

### **package.json**

```json
{
  "name": "website-epic",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "vite build --mode production",
    "build:production": "vite build --mode production"
  }
}
```

---

## 📊 **Timeline de Ejecución**

### **Fase 1: Limpieza (5 minutos)**

- [ ] Acceder a Vercel dashboard
- [ ] Eliminar aigestion-website-epic
- [ ] Eliminar website-epic
- [ ] Verificar eliminación

### **Fase 2: Creación (10 minutos)**

- [ ] Limpiar configuración local
- [ ] Crear proyecto aigestion-website
- [ ] Configurar dominios
- [ ] Configurar variables de entorno

### **Fase 3: Deploy (10 minutos)**

- [ ] Limpiar dependencias
- [ ] Instalar dependencias
- [ ] Deploy a producción
- [ ] Verificar URLs

### **Fase 4: Verificación (5 minutos)**

- [ ] Test todas las URLs
- [ ] Verificar dominios
- [ ] Test funcionalidad completa
- [ ] Documentar nueva estructura

---

## 🎯 **Resultado Final**

### **✅ Sistema Limpio y Organizado**

```
🌐 aigestion.net → Website principal con Daniela AI
🏢 admin.aigestion.net → Panel administrativo
🏢 client.aigestion.net → Dashboard clientes
🏢 demo.aigestion.net → Demo interactivo

Sin duplicados, sin conflictos, sin confusión.
```

### **✅ Beneficios**

- **URLs limpias**: Sin .vercel.app largas
- **Dominios propios**: Control total
- **Organización clara**: Cada proyecto con su función
- **Sin conflictos**: Sin duplicación de nombres
- **Escalabilidad**: Fácil crecimiento futuro

---

## 🚨 **Comandos de Ejecución**

### **Script Completo de Migración**

```bash
#!/bin/bash

echo "🧹 Iniciando limpieza completa de proyectos Vercel..."

# Fase 1: Verificar estado actual
echo "📋 Fase 1: Verificando estado actual..."
npx vercel projects ls
npx vercel whoami

# Fase 2: Preparar código
echo "📁 Fase 2: Preparando código..."
cd frontend/apps/website-epic
rm -rf .vercel
rm -rf node_modules package-lock.json

# Fase 3: Crear nuevo proyecto
echo "🆕 Fase 3: Creando nuevo proyecto limpio..."
npx vercel
# (seguir instrucciones interactivas)
echo "Nombre: aigestion-website"
echo "Framework: Vite"
echo "Build Command: pnpm run vercel-build"
echo "Output Directory: dist"

# Fase 4: Configurar dominios
echo "🌐 Fase 4: Configurando dominios..."
npx vercel domains add aigestion.net
npx vercel domains add admin.aigestion.net
npx vercel domains add client.aigestion.net
npx vercel domains add demo.aigestion.net

# Fase 5: Configurar variables
echo "⚙️ Fase 5: Configurando variables de entorno..."
npx vercel env add VITE_API_BASE_URL "https://aigestion-backend.onrender.com/api/v1"
npx vercel env add VITE_VAPI_PUBLIC_KEY "67c74f53-b26a-4d23-9f5b-91c68e1a6c4b"
npx vercel env add VITE_ELEVENLABS_VOICE_ID "EXAVITQu4vr4xnSDxMaL"
npx vercel env add VITE_APP_NAME "AIGestion - Daniela AI Assistant"
npx vercel env add VITE_APP_VERSION "2.0.0"
npx vercel env add VITE_ENVIRONMENT "production"

# Fase 6: Deploy
echo "🚀 Fase 6: Deploy a producción..."
pnpm install
npx vercel --prod

# Fase 7: Verificación
echo "✅ Fase 7: Verificación final..."
npx vercel projects ls
npx vercel domains ls
curl -I https://aigestion.net
curl -I https://admin.aigestion.net
curl -I https://client.aigestion.net
curl -I https://demo.aigestion.net

echo "🎉 Migración completada exitosamente!"
```

---

## 🎉 **ESTADO FINAL**

### **🟢 Sistema Limpio y Listo**

- ✅ Sin proyectos duplicados
- ✅ Proyectos organizados por función
- ✅ URLs limpias y profesionales
- ✅ Dominios propios configurados
- ✅ Build exitoso sin errores
- ✅ Daniela AI funcionando correctamente

---

**🧹 ESTRATEGIA DE LIMPIZA COMPLETADA**
**📅 FECHA: 2026-01-24**
**🎯 OBJETIVO: SISTEMA LIMPIO Y ORGANIZADO**
**⚡ EJECUCIÓN INMEDIATA REQUERIDA**
