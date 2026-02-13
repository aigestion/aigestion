# 🌩️ Google Cloud Console Setup - AIGestion Sovereign

## 📋 Guía Completa de Configuración

Paso a paso para crear y configurar el proyecto "AIGestion Sovereign" en Google Cloud Console

---

## 🔧 Paso 1: Crear Proyecto

### 1.1 Acceder a Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Inicia sesión con tu cuenta de Google
3. Acepta los términos de servicio si es necesario

### 1.2 Crear Nuevo Proyecto

1. Haz clic en el selector de proyectos (arriba izquierda)
2. Haz clic en **"NUEVO PROYECTO"**
3. Configura el proyecto:
   ```
   Nombre del proyecto: AIGestion Sovereign
   ID del proyecto: aigestion-sovereign (se genera automáticamente)
   Organización: (tu cuenta personal o organización)
   Ubicación: No organization / [tu organización]
   ```
4. Haz clic en **"CREAR"**
5. Espera 2-3 minutos mientras se crea el proyecto

---

## 🔑 Paso 2: Habilitar API de Gemini Pro

### 2.1 Buscar API

1. En el menú izquierdo, ve a **"API y servicios"** → **"Biblioteca"**
2. En el buscador, escribe: **"Generative Language API"**
3. Selecciona **"Generative Language API"** de Google

### 2.2 Habilitar API

1. Haz clic en **"HABILITAR"**
2. Espera la confirmación (puede tardar 1-2 minutos)
3. Verás el mensaje: "API habilitada correctamente"

### 2.3 APIs Adicionales Recomendadas

También habilita estas APIs para AIGestion:

- **Cloud Vision API** (para análisis de imágenes)
- **Cloud Natural Language API** (para análisis de texto)
- **Cloud Translation API** (para multilingüe)

---

## 🔐 Paso 3: Crear API Key Segura

### 3.1 Crear Credenciales

1. Ve a **"API y servicios"** → **"Credenciales"**
2. Haz clic en **"+ CREAR CREDENCIALES"**
3. Selecciona **"Clave de API"**

### 3.2 Configurar API Key

1. **Nombre**: `AIGestion-Gemini-Pro-Key`
2. **Restricciones de API**:
   - Selecciona **"Restringir clave"**
   - En "Seleccionar APIs", busca y selecciona:
     - ✅ Generative Language API
     - ✅ Cloud Vision API (opcional)
     - ✅ Cloud Natural Language API (opcional)
3. **Restricciones de aplicación**:
   - Selecciona **"Direcciones IP (servidores web, trabajos cron, etc.)"**
   - Añade tu IP actual (puedes obtenerla en https://whatismyipaddress.com/)
   - Para desarrollo local, puedes dejarlo sin restricciones temporariamente
4. Haz clic en **"CREAR"**

### 3.3 Copiar y Guardar API Key

1. **COPIA INMEDIATAMENTE** la API key generada
2. Guárdala en un lugar seguro (gestor de contraseñas)
3. **No compartas esta key públicamente**

---

## 🛡️ Paso 4: Configurar Seguridad Adicional

### 4.1 Configurar Cuotas y Límites

1. Ve a **"API y servicios"** → **"Cuotas"**
2. Busca **"Generative Language API"**
3. Configura límites diarios para evitar costos inesperados:
   - **Requests por día**: 1000 (ajusta según necesidad)
   - **Tokens por día**: 100,000 (ajusta según necesidad)

### 4.2 Configurar Alertas

1. Ve a **"Facturación"** → **"Presupuestos"**
2. Crea un presupuesto mensual (ej: $50 USD)
3. Configura alertas al 50%, 90% y 100% del presupuesto

---

## 🔧 Paso 5: Configurar en AIGestion

### 5.1 Actualizar Archivo .env.gemini

Edita el archivo: `c:\Users\Alejandro\AIGestion\.env.gemini`

```bash
# Reemplaza con tu nueva API key
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Configuración del proyecto
GEMINI_PROJECT_ID=aigestion-sovereign
GEMINI_PROJECT_NUMBER=123456789012  # Reemplaza con tu número de proyecto

# Configuración de la API
GEMINI_MODEL=gemini-1.5-pro
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=2048
GEMINI_TOP_P=0.8
GEMINI_TOP_K=40

# Configuración AIGestion
GEMINI_CONTEXT=AIGestion Sovereign AI Assistant
GEMINI_LANGUAGE=es
GEMINI_RESPONSE_FORMAT=json
```

### 5.2 Obtener Project Number

1. En Google Cloud Console, ve a **"IAM y administración"** → **"Configuración"**
2. Copia el **"Número de proyecto"**
3. Añádelo al archivo `.env.gemini`

---

## 🧪 Paso 6: Probar Configuración

### 6.1 Probar con PowerShell

```powershell
cd c:\Users\Alejandro\AIGestion\scripts\ai

# Probar conexión
.\AIGestion-Gemini-Integration.ps1 -Test

# Si funciona, verás una respuesta de Gemini Pro
```

### 6.2 Probar con TypeScript

```bash
cd c:\Users\Alejandro\AIGestion\frontend\apps\website-epic

# Iniciar desarrollo
npm run dev

# En el navegador, consola:
import { geminiService } from './src/services/gemini-service';
const response = await geminiService.generateContent('Test de AIGestion');
console.log(response);
```

---

## 📊 Paso 7: Monitoreo y Mantenimiento

### 7.1 Dashboard de Monitoreo

1. Ve a **"API y servicios"** → **"Panel"**
2. Monitoriza el uso de la API en tiempo real
3. Revisa métricas de rendimiento

### 7.2 Logs y Errores

1. Ve a **"Logging"** → **"Explorador de registros"**
2. Filtra por: `resource.type="generative_language_api"`
3. Revisa errores y advertencias

---

## 🚨 Solución de Problemas Comunes

### Problema: "API key no válida"

- ✅ Verifica que la API key esté correctamente copiada
- ✅ Confirma que la API esté habilitada
- ✅ Revisa las restricciones de IP

### Problema: "Cuota excedida"

- ✅ Revisa los límites configurados
- ✅ Aumenta las cuotas si es necesario
- ✅ Implementa caching para reducir llamadas

### Problema: "Permiso denegado"

- ✅ Verifica las restricciones de API
- ✅ Confirma que el proyecto esté activo
- ✅ Revisa la configuración de IAM

---

## 📋 Checklist Final

- [ ] ✅ Proyecto "AIGestion Sovereign" creado
- [ ] ✅ Generative Language API habilitada
- [ ] ✅ API key generada y restringida
- [ ] ✅ Cuotas y límites configurados
- [ ] ✅ Presupuesto y alertas configurados
- [ ] ✅ Archivo .env.gemini actualizado
- [ ] ✅ Conexión probada exitosamente
- [ ] ✅ Monitoreo configurado

---

## 🎯 URLs Importantes

- **Google Cloud Console**: https://console.cloud.google.com/
- **API Manager**: https://console.cloud.google.com/apis/
- **Credenciales**: https://console.cloud.google.com/apis/credentials
- **Facturación**: https://console.cloud.google.com/billing
- **IAM y Admin**: https://console.cloud.google.com/iam-admin/

---

## 🎉 Estado Final

Una vez completados estos pasos, tendrás:

✅ **Proyecto AIGestion Sovereign** configurado en Google Cloud
✅ **API de Gemini Pro** habilitada y funcionando
✅ **API key segura** con restricciones adecuadas
✅ **Monitoreo y alertas** configurados
✅ **Integración completa** con el ecosistema AIGestion

**🔥 AIGESTION SOVEREIGN LISTO PARA PRODUCCIÓN! 🚀**

_Tu proyecto de IA soberano con la tecnología más avanzada de Google_
