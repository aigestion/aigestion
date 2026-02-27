# 📞 Configuración Completa Twilio - Daniela IA Voice System

## 🎯 **RESUMEN DE CONFIGURACIÓN**

Esta guía te permite configurar el sistema completo de llamadas de Twilio para que Daniela IA atienda las llamadas automáticamente.

### **🔧 Componentes a Configurar**

1. **📞 Webhook Principal** - Maneja llamadas entrantes
2. **📋 TwiML Bin** - Contenido XML para respuestas de voz
3. **🔍 Caller Name Lookup** - Identificación de llamantes (+$0.01 por llamada)
4. **📊 Status Callback** - Seguimiento de estado de llamadas
5. **🔄 Fallback Handler** - Manejo de errores

---

## 🚀 **CONFIGURACIÓN RÁPIDA**

### **Opción 1: Configuración Automática Completa**

```powershell
# Ejecutar configuración completa automáticamente
.\Twilio-Complete-Setup.ps1 -Interactive

# O con prueba de llamada incluida
.\Twilio-Complete-Setup.ps1 -Interactive -TestCall
```

### **Opción 2: Configuración Manual Paso a Paso**

```powershell
# 1. Configurar webhook de voz
.\Twilio-Complete-Setup.ps1 -Interactive
# Seleccionar opción 1

# 2. Crear TwiML Bin
# Seleccionar opción 2

# 3. Activar Caller Name Lookup
# Seleccionar opción 3

# 4. Probar llamada
# Seleccionar opción 4
```

---

## 📋 **CONFIGURACIÓN WEBHOOK DETALLADA**

### **🌐 URLs de Webhook**

#### **Webhook Principal (Llamadas Entrantes)**
```
URL: https://aigestion.net/api/twilio/voice
Método: HTTP POST
Timeout: 15 segundos
```

#### **Webhook de Fallback (Si falla el principal)**
```
URL: https://aigestion.net/api/twilio/fallback
Método: HTTP POST
```

#### **Status Callback (Cambios de estado)**
```
URL: https://aigestion.net/api/twilio/call-status
Método: HTTP POST
Eventos: Todos (initiated, ringing, answered, completed)
```

### **📋 TwiML Bin Configuration**

#### **TwiML de Bienvenida**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" timeout="3" language="es-ES" 
            action="https://aigestion.net/api/twilio/process-speech" method="POST">
        <Say language="es-ES" voice="Polly.Lucia-Neural">
            ¡Hola! Soy Daniela IA, tu asistente inteligente de AIGestion.
            Estoy aquí para ayudarte con lo que necesites.
            Puedes decirme si quieres información sobre ventas, soporte técnico,
            solicitar una demostración o conocer nuestros precios.
            ¿En qué puedo asistirte hoy?
        </Say>
    </Gather>
    <Say language="es-ES" voice="Polly.Lucia-Neural">
        No he detectado tu respuesta.
        En un momento te conectaré con un especialista.
        Gracias por llamar a AIGestion.
    </Say>
    <Redirect>https://aigestion.net/api/twilio/fallback</Redirect>
</Response>
```

---

## 🔍 **CALLER NAME LOOKUP CONFIGURATION**

### **Activación**
- **Costo**: +$0.01 por llamada
- **Beneficio**: Identificación automática del llamante
- **Configuración**: Se activa automáticamente con el script

### **Datos Proporcionados**
- Nombre del llamante (si está disponible)
- Tipo de número (móvil, fijo, empresarial)
- Ubicación geográfica
- Proveedor de telefonía

---

## 📊 **ESTADOS DE LLAMADA MONITORIZADOS**

### **Eventos Tracking**
```
✅ queued - Llamada en cola
✅ ringing - Sonando en destino
✅ in-progress - Llamada activa
✅ completed - Llamada finalizada
✅ busy - Ocupado
✅ no-answer - Sin respuesta
✅ failed - Falló la llamada
✅ canceled - Cancelada
```

### **Datos Registrados**
- Call SID (identificador único)
- Timestamp de cada estado
- Duración de la llamada
- Número origen y destino
- Costo de la llamada
- Grabación (si está activada)

---

## 🤖 **INTEGRACIÓN CON IA DANIELA**

### **Flujo de Llamada**
```
📞 Cliente llama → +1 618 358 1369
       ↓
🤖 Daniela IA contesta automáticamente
       ↓
🗣️ Cliente habla (ventas, soporte, demo, etc.)
       ↓
🧠 IA analiza intención con OpenAI/Gemini
       ↓
🎯 Respuesta personalizada o transferencia
       ↓
📊 Registro en base de datos y analytics
```

### **Intenciones Reconocidas**
- **Ventas/Precios**: Transferencia a ventas o información automática
- **Soporte Técnico**: Conexión con equipo técnico
- **Demostración**: Agendamiento inmediato o programado
- **Información General**: Respuestas automatizadas
- **Desconocido**: Transferencia a operador humano

---

## 🛠️ **CONFIGURACIÓN DEL SERVIDOR WEBHOOK**

### **Requisitos Previos**
```bash
# Instalar dependencias
npm install express twilio body-parser

# Variables de entorno
TWILIO_ACCOUNT_SID=REDACTED_TWILIO_SID
TWILIO_AUTH_TOKEN=AUTH_TOKEN_REDACTED
PORT=3000
BASE_URL=https://aigestion.net
```

### **Iniciar Servidor**
```bash
# Development
node twilio-webhook-config.js

# Production con PM2
pm2 start twilio-webhook-config.js --name "twilio-webhook"

# Con Docker
docker run -d -p 3000:3000 --name twilio-webhook aigestion/twilio-webhook
```

---

## 🧪 **PRUEBAS Y VERIFICACIÓN**

### **Probar Webhook Localmente**
```bash
# Usar ngrok para exponer localhost
ngrok http 3000

# Configurar webhook con URL de ngrok
https://a1b2-c3d4-e5f6.ngrok.io/api/twilio/voice
```

### **Probar Llamada con Script**
```powershell
# Probar llamada al teléfono personal
.\Twilio-Complete-Setup.ps1 -Interactive -TestCall

# O manualmente
$call = .\Twilio-Advanced-Features.ps1 -Action "voice" -To "+34618779308"
```

### **Verificar Configuración**
```powershell
# Ver estado actual
.\Twilio-Complete-Setup.ps1 -Interactive
# Seleccionar opción 6

# Ver logs de llamadas
Get-Content -Path "logs\twilio-calls.log" -Tail 10
```

---

## 📈 **MONITORIZACIÓN Y ANALYTICS**

### **Métricas Disponibles**
- **Volumen de llamadas**: Número total de llamadas recibidas
- **Tasa de respuesta**: % de llamadas contestadas por IA
- **Duración promedio**: Tiempo promedio de las llamadas
- **Intenciones detectadas**: Distribución de tipos de solicitudes
- **Transferencias**: % de llamadas transferidas a humanos

### **Dashboard en Tiempo Real**
```javascript
// Endpoint para dashboard
GET /api/twilio/analytics
{
  "totalCalls": 150,
  "answeredByAI": 138,
  "transferRate": 8,
  "averageDuration": "2:45",
  "topIntents": ["ventas", "soporte", "demo"],
  "costToday": "$12.50"
}
```

---

## 🚨 **MANEJO DE ERRORES Y FALLBACK**

### **Escenarios de Error**
1. **Webhook no disponible**: Redirección a TwiML Bin
2. **IA no responde**: Transferencia a operador
3. **Timeout de llamada**: Mensaje de despedida automático
4. **Número no válido**: Error amigable con sugerencias

### **Configuración de Fallback**
```
Primary Handler: https://aigestion.net/api/twilio/voice
Fallback Handler: https://aigestion.net/api/twilio/fallback
Error Handler: TwiML Bin estático
```

---

## 💰 **COSTOS Y FACTURACIÓN**

### **Costos por Llamada**
- **Llamada entrante**: $0.0085/minuto (EE.UU.)
- **Llamada saliente**: $0.013/minuto (España)
- **Caller Name Lookup**: +$0.01 por llamada
- **Transcripción**: $0.0006/segundo (opcional)
- **Grabación**: $0.0025/minuto (opcional)

### **Estimación Mensual**
```
100 llamadas × 3 minutos promedio:
- Llamadas: $2.55
- Caller ID: $1.00
- Total estimado: ~$3.55/mes
```

---

## 🔐 **SEGURIDAD Y BUENAS PRÁCTICAS**

### **Seguridad de Webhooks**
- Validar firma de Twilio en cada request
- Usar HTTPS obligatoriamente
- Limitar rate de llamadas por IP
- Sanitizar toda la entrada de voz

### **Validación de Firma**
```javascript
const twilio = require('twilio');
const request = require('request');

const url = 'https://aigestion.net/api/twilio/voice';
const params = req.body;
const signature = req.headers['x-twilio-signature'];
const token = process.env.TWILIO_AUTH_TOKEN;

const isValid = twilio.validateRequest(token, signature, url, params);
if (!isValid) {
    return res.status(403).send('Invalid signature');
}
```

---

## 📞 **CONFIGURACIÓN FINAL**

### **Resumen de URLs**
```
📞 Voice URL: https://aigestion.net/api/twilio/voice
🔄 Fallback: https://aigestion.net/api/twilio/fallback
📊 Status: https://aigestion.net/api/twilio/call-status
🤖 IA Processing: https://aigestion.net/api/twilio/process-speech
📅 Demo Scheduling: https://aigestion.net/api/twilio/schedule-demo
```

### **Número de Teléfono Configurado**
```
📞 +1 618 358 1369 (Twilio USA)
🤖 Daniela IA integrada
🌐 Disponible 24/7
💰 Costo optimizado
📊 Analytics completos
```

---

## 🎉 **PRÓXIMOS PASOS**

1. **✅ Ejecutar script de configuración**
2. **✅ Probar llamada de prueba**
3. **✅ Verificar logs y analytics**
4. **✅ Configurar monitoring**
5. **✅ Documentar para equipo**

### **Comandos Finales**
```powershell
# Configuración completa con prueba
.\Twilio-Complete-Setup.ps1 -Interactive -TestCall

# Ver estado
curl https://aigestion.net/api/twilio/analytics

# Probar webhook
curl -X POST https://aigestion.net/api/twilio/voice
```

---

## 🆘 **SOPORTE Y TROUBLESHOOTING**

### **Problemas Comunes**
- **Webhook no responde**: Verificar firewall y SSL
- **Voz robótica**: Configurar voz Polly correctamente
- **No detecta intención**: Revisar modelo de IA
- **Costos elevados**: Monitorear duración de llamadas

### **Comandos de Debug**
```powershell
# Ver logs de errores
Get-EventLog -LogName Application -Source "Twilio" -Newest 10

# Test de conexión
Test-NetConnection -ComputerName "api.twilio.com" -Port 443

# Ver configuración actual
Get-TwilioAccount -AccountSid $sid
```

---

**🔥 CONFIGURACIÓN COMPLETA - DANIELA IA ESTÁ LISTA PARA RECIBIR LLAMADAS! 🚀**

*Donde cada llamada se convierte en una experiencia inteligente y personalizada.*
