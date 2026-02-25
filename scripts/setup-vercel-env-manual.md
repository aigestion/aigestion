# 🔧 CONFIGURACIÓN MANUAL DE VARIABLES VERCEL - AIGESTION

## 📋 PASOS PARA CONFIGURAR VARIABLES DE ENTORNO EN VERCEL

### 1. Acceder a Vercel Dashboard
1. Ve a: https://vercel.com/dashboard
2. Inicia sesión con tu cuenta
3. Busca el proyecto: `aigestions-projects/website-epic`

### 2. Configurar Variables de Entorno
1. En el proyecto, ve a **Settings → Environment Variables**
2. Agrega las siguientes variables:

#### Variables Críticas:
```
VITE_SUPABASE_URL=https://nbymcxvlcfyhebzjurml.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieW1jeHZsY2Z5aGViemp1cm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NzU1MDAsImV4cCI6MjA4NTE1MTUwMH0.naLyb4Fc2o0-c4K2S_D7rEXasUN-xu7zcBtX-nVHldA
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GOOGLE_ANALYTICS_DEBUG=false
VITE_GOOGLE_ANALYTICS_TRACKING=true
VITE_APP_NAME=AIGestion Nexus
VITE_APP_VERSION=2.0.0
VITE_APP_URL=https://aigestion.net
VITE_API_BASE_URL=/api
VITE_MAINTENANCE_MODE=false
```

### 3. Guardar Variables
1. Haz clic en **Save**
2. Espera a que se guarden
3. Verifica que todas las variables estén listas

### 4. Forzar Deploy
Una vez configuradas las variables:
```bash
cd c:\Users\Alejandro\AIGestion\frontend\apps\website-epic
npx vercel --prod --force
```

## 🎯 VARIABLES EXPLICADAS

### VITE_SUPABASE_URL
URL de la base de datos Supabase
- **Valor**: `https://nbymcxvlcfyhebzjurml.supabase.co`
- **Uso**: Conexión frontend a Supabase

### VITE_SUPABASE_ANON_KEY
Key pública de Supabase para autenticación
- **Valor**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Uso**: Acceso anónimo a Supabase

### VITE_GOOGLE_ANALYTICS_ID
ID de Google Analytics 4
- **Valor**: `G-XXXXXXXXXX` (placeholder)
- **Uso**: Tracking de usuarios y eventos

### VITE_APP_NAME
Nombre de la aplicación
- **Valor**: `AIGestion Nexus`
- **Uso**: Identificación en analytics

## 🚀 VERIFICACIÓN POST-CONFIGURACIÓN

### 1. Verificar Deploy
```bash
curl -I https://aigestion.net
# Debe mostrar nueva fecha de Last-Modified
```

### 2. Verificar Analytics
- Abre: https://aigestion.net/test-analytics.html
- Haz clic en los botones de prueba
- Verifica en Google Analytics tiempo real

### 3. Verificar Funcionalidad
- Navega por el website
- Prueba las características principales
- Confirma que todo funciona

## 🔥 ESTADO ACTUAL

**Variables necesarias configuradas:**
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ VITE_GOOGLE_ANALYTICS_ID
- ✅ VITE_APP_NAME
- ✅ VITE_APP_URL

**Próximo paso:**
- Configurar variables en Vercel Dashboard
- Forzar deploy actualizado
- Verificar funcionamiento 100%

## 📊 RESULTADO ESPERADO

Después de configurar las variables:
- ✅ Deploy actualizado con Analytics
- ✅ Google Analytics funcionando
- ✅ Todas las características activas
- ✅ AIGestion 100% completado

---

*Última actualización: 24/02/2026*
*Estado: Variables listas para configuración manual*
