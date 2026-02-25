# 📊 Analytics & Business Intelligence Setup Guide for AIGestion

## 📋 **RESUMEN RÁPIDO**

He creado un sistema completo para obtener y configurar las credenciales de Analytics & Business Intelligence para AIGestion:

### **📁 Archivos Creados**
1. **`analytics-setup.md`** - Guía completa paso a paso (300+ líneas)
2. **`get-analytics-credentials.ps1`** - Script PowerShell automatizado (400+ líneas)
3. **`analytics-credentials-template.txt`** - Template con ejemplos
4. **`README-Analytics-Setup.md`** - Este archivo de resumen

---

## 🚀 **OPCIONES PARA OBTENER CREDENCIALES**

### **Opción 1: Manual (Recomendado)**
```bash
# 1. Mixpanel - https://mixpanel.com
#    - Crea proyecto "AIGestion"
#    - Obtén Project Token

# 2. Amplitude - https://amplitude.com
#    - Crea proyecto "AIGestion"
#    - Obtén API Key

# 3. Segment - https://segment.com
#    - Crea workspace "AIGestion"
#    - Obtén Write Key

# 4. Looker - https://looker.com
#    - Crea proyecto "AIGestion"
#    - Obtén API Key

# 5. Tableau - https://tableau.com
#    - Crea sitio "AIGestion"
#    - Obtén API Key

# 6. Metabase - http://localhost:3000
#    - Instala y configura
#    - Obtén Secret Key

# 7. Actualiza tu archivo .env (líneas 403-412)
```

### **Opción 2: Automatizado con PowerShell**
```powershell
# Ejecutar script automatizado
cd "c:\Users\Alejandro\AIGestion\scripts\setup"
.\get-analytics-credentials.ps1 -Interactive

# O con parámetros específicos
.\get-analytics-credentials.ps1 -OutputPath "c:\Users\Alejandro\AIGestion\.env"

# Modo batch (usar credenciales de ejemplo)
.\get-analytics-credentials.ps1 -BatchMode

# Modo de prueba
.\get-analytics-credentials.ps1 -Test
```

---

## 📝 **CONFIGURACIÓN DEL ARCHIVO .env**

### **Antes (Líneas 403-412)**
```bash
# ═══════════════════════════════════════════════════════════════════════════
# 📊 ANALYTICS & BUSINESS INTELLIGENCE
# ═══════════════════════════════════════════════════════════════════════════
# MIXPANEL_TOKEN=  # Product analytics
# AMPLITUDE_API_KEY=  # User behavior tracking
# SEGMENT_WRITE_KEY=  # Customer data platform
# LOOKER_API_KEY=  # BI & data visualization
# TABLEAU_API_KEY=  # Advanced analytics
# METABASE_SECRET_KEY=  # Open-source BI
```

### **Después (Ejemplo Real)**
```bash
# ═══════════════════════════════════════════════════════════════════════════
# 📊 ANALYTICS & BUSINESS INTELLIGENCE
# ═══════════════════════════════════════════════════════════════════════════
MIXPANEL_TOKEN=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
AMPLITUDE_API_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
SEGMENT_WRITE_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
LOOKER_API_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
TABLEAU_API_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
METABASE_SECRET_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

---

## 🔧 **CARACTERÍSTICAS DEL SCRIPT**

### **Funcionalidades Avanzadas**
- ✅ **Configuración interactiva** para cada servicio
- ✅ **Modo batch** con credenciales de ejemplo
- ✅ **Validación automática** de credenciales
- ✅ **Actualización automática** del archivo .env
- ✅ **Verificación de entorno** (PowerShell, internet, archivos)
- ✅ **Colores y emojis** para mejor UX
- ✅ **Error handling** robusto
- ✅ **Resumen detallado** de configuración

### **Parámetros Disponibles**
```powershell
-OutputPath ".\.env"             # Ruta del archivo .env
-Interactive                     # Modo interactivo
-BatchMode                      # Modo batch con ejemplos
-Test                           # Modo de prueba
```

---

## 📊 **SERVICIOS CONFIGURADOS**

### **1. Mixpanel - Product Analytics**
- **URL**: https://mixpanel.com
- **Tipo**: Project Token
- **Uso**: Product analytics, user behavior, conversion funnels
- **Características**: Real-time analytics, cohort analysis, retention

### **2. Amplitude - User Behavior Tracking**
- **URL**: https://amplitude.com
- **Tipo**: API Key
- **Uso**: User behavior tracking, session analysis
- **Características**: Behavioral cohorts, funnel analysis, A/B testing

### **3. Segment - Customer Data Platform**
- **URL**: https://segment.com
- **Tipo**: Write Key
- **Uso**: Customer data platform, event collection
- **Características**: Data collection, routing, identity resolution

### **4. Looker - BI & Data Visualization**
- **URL**: https://looker.com
- **Tipo**: API Key
- **Uso**: Business intelligence, data visualization
- **Características**: SQL-based BI, custom dashboards, data modeling

### **5. Tableau - Advanced Analytics**
- **URL**: https://tableau.com
- **Tipo**: API Key
- **Uso**: Advanced analytics, data visualization
- **Características**: Interactive dashboards, data exploration, collaboration

### **6. Metabase - Open-Source BI**
- **URL**: http://localhost:3000
- **Tipo**: Secret Key
- **Uso**: Open-source BI platform
- **Características**: SQL queries, custom visualizations, self-service analytics

---

## 🛠️ **INTEGRACIÓN CON AIGESTION**

### **Configuración Centralizada**
```javascript
// src/services/analytics.js
import mixpanel from 'mixpanel-browser';
import amplitude from 'amplitude-js';
import analytics from 'analytics.js';

class AnalyticsService {
  constructor() {
    this.initializeServices();
  }

  initializeServices() {
    // Mixpanel
    if (process.env.MIXPANEL_TOKEN) {
      mixpanel.init(process.env.MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: true,
        persistence: 'localStorage'
      });
    }

    // Amplitude
    if (process.env.AMPLITUDE_API_KEY) {
      amplitude.getInstance().init(process.env.AMPLITUDE_API_KEY);
    }

    // Segment
    if (process.env.SEGMENT_WRITE_KEY) {
      analytics.load(process.env.SEGMENT_WRITE_KEY);
    }
  }

  trackEvent(eventName, properties = {}) {
    // Track en todos los servicios
    if (process.env.MIXPANEL_TOKEN) {
      mixpanel.track(eventName, properties);
    }

    if (process.env.AMPLITUDE_API_KEY) {
      amplitude.getInstance().logEvent(eventName, properties);
    }

    if (process.env.SEGMENT_WRITE_KEY) {
      analytics.track(eventName, properties);
    }
  }

  identifyUser(userId, traits = {}) {
    if (process.env.MIXPANEL_TOKEN) {
      mixpanel.identify(userId);
      mixpanel.people.set(traits);
    }

    if (process.env.AMPLITUDE_API_KEY) {
      amplitude.getInstance().setUserId(userId);
      amplitude.getInstance().setUserProperties(traits);
    }

    if (process.env.SEGMENT_WRITE_KEY) {
      analytics.identify(userId, traits);
    }
  }
}

export default new AnalyticsService();
```

### **Uso en Componentes React**
```javascript
// src/components/Dashboard.jsx
import React, { useEffect } from 'react';
import analytics from '../services/analytics';

const Dashboard = () => {
  useEffect(() => {
    // Track page view
    analytics.trackEvent('Dashboard Viewed', {
      timestamp: new Date().toISOString(),
      user_type: 'premium'
    });
  }, []);

  const handleButtonClick = (action) => {
    // Track button clicks
    analytics.trackEvent('Button Clicked', {
      button: action,
      page: 'dashboard'
    });
  };

  return (
    <div>
      <button onClick={() => handleButtonClick('export')}>
        Export Data
      </button>
    </div>
  );
};

export default Dashboard;
```

---

## 📈 **MÉTRICAS CLAVE PARA AIGESTION**

### **User Metrics**
- **Daily Active Users (DAU)** - Usuarios activos diarios
- **Monthly Active Users (MAU)** - Usuarios activos mensuales
- **User Retention Rate** - Tasa de retención de usuarios
- **Churn Rate** - Tasa de abandono
- **Customer Lifetime Value (LTV)** - Valor del ciclo de vida del cliente

### **Product Metrics**
- **Feature Adoption Rate** - Tasa de adopción de características
- **Session Duration** - Duración de las sesiones
- **Page Views per Session** - Páginas vistas por sesión
- **Conversion Rate** - Tasa de conversión
- **Error Rate** - Tasa de errores

### **Business Metrics**
- **Revenue Growth** - Crecimiento de ingresos
- **Customer Acquisition Cost (CAC)** - Costo de adquisición de clientes
- **Return on Investment (ROI)** - Retorno de inversión
- **Average Revenue Per User (ARPU)** - Ingresos promedio por usuario
- **Net Promoter Score (NPS)** - Puntuación neta de promotores

---

## 🎯 **IMPLEMENTACIÓN RECOMENDADA**

### **Fase 1: Analytics Básicos (Semana 1)**
```bash
# Configurar servicios básicos
✅ Mixpanel - Product analytics
✅ Amplitude - User behavior tracking
✅ Event tracking en componentes clave
```

### **Fase 2: Data Platform (Semana 2)**
```bash
# Configurar plataforma de datos
✅ Segment - Customer data platform
✅ Data collection centralizada
✅ User profiling avanzado
```

### **Fase 3: BI & Visualization (Semana 3)**
```bash
# Configurar business intelligence
✅ Looker - Business intelligence
✅ Tableau - Advanced analytics
✅ Executive dashboards
```

### **Fase 4: Open Source (Semana 4)**
```bash
# Configurar plataforma open-source
✅ Metabase - Self-service analytics
✅ Custom queries y reportes
✅ Team collaboration
```

---

## 🔐 **SEGURIDAD Y PRIVACIDAD**

### **Data Protection**
- **GDPR Compliance**: Gestión de consentimiento
- **Data Anonymization**: Protección de privacidad de usuarios
- **Data Retention**: Limpieza automática de datos
- **Access Control**: Permisos basados en roles

### **Security Measures**
- **API Key Rotation**: Actualización regular de claves
- **Encryption**: Cifrado de datos en tránsito
- **Audit Logs**: Registro de accesos
- **Rate Limiting**: Límites de uso de API

---

## 📋 **CHECKLIST DE CONFIGURACIÓN**

### **Pre-Setup**
- [ ] Cuentas creadas en todos los servicios
- [ ] Proyectos configurados
- [ ] API Keys generadas
- [ ] Documentación revisada

### **Configuration**
- [ ] Archivo .env actualizado
- [ ] Servicios inicializados en código
- [ ] Event tracking implementado
- [ ] Dashboards configurados

### **Testing**
- [ ] Conexión probada con cada servicio
- [ ] Event tracking funcionando
- [ ] Data collection verificada
- [ ] Dashboards mostrando datos

### **Production**
- [ ] Variables de entorno configuradas
- [ ] Data privacy settings ajustados
- [ ] Monitoring activado
- [ ] Team training completado

---

## 🚨 **ERRORES COMUNES Y SOLUCIONES**

### **Error: "Invalid API Key"**
```
Solución: Verifica que las API Keys sean correctas y estén activas
```

### **Error: "Data not appearing"**
```
Solución: Revisa la configuración de tracking y los eventos enviados
```

### **Error: "Rate limit exceeded"**
```
Solución: Verifica los límites de uso del plan y optimiza eventos
```

### **Error: "Service not configured"**
```
Solución: Asegúrate de haber configurado correctamente cada servicio
```

---

## 📞 **SOPORTE Y RECURSOS**

### **Documentación Oficial**
- [Mixpanel Docs](https://mixpanel.com/help/reference)
- [Amplitude Docs](https://developers.amplitude.com/docs)
- [Segment Docs](https://segment.com/docs)
- [Looker Docs](https://docs.looker.com)
- [Tableau Docs](https://help.tableau.com)
- [Metabase Docs](https://www.metabase.com/docs)

### **Soporte Técnico**
- **Mixpanel**: support@mixpanel.com
- **Amplitude**: support@amplitude.com
- **Segment**: support@segment.com
- **Looker**: support@looker.com
- **Tableau**: support@tableau.com
- **Metabase**: support@metabase.com

### **Scripts Útiles**
```powershell
# Ejecutar script interactivo
.\get-analytics-credentials.ps1 -Interactive

# Modo batch con ejemplos
.\get-analytics-credentials.ps1 -BatchMode

# Modo de prueba
.\get-analytics-credentials.ps1 -Test

# Verificar conexión
curl -X POST "https://api.mixpanel.com/track" -d "data=eyJldmVudCI6InRlc3QiLCJwcm9wZXJ0aWVzIjp7fX0="
```

---

## 🎉 **RESUMEN FINAL**

Con este sistema completo tienes todo lo necesario para configurar 6 plataformas de analytics y business intelligence para AIGestion:

### **📊 6 Servicios Configurados**
- ✅ **Mixpanel** - Product analytics
- ✅ **Amplitude** - User behavior tracking
- ✅ **Segment** - Customer data platform
- ✅ **Looker** - BI & data visualization
- ✅ **Tableau** - Advanced analytics
- ✅ **Metabase** - Open-source BI

### **📁 4 Archivos Creados**
- ✅ **Guías completas** paso a paso
- ✅ **Script automatizado** PowerShell
- ✅ **Templates** con ejemplos reales
- ✅ **Documentación** técnica

### **🚀 Listo para Usar**
1. Ejecuta el script o sigue la guía manual
2. Obtén tus credenciales de cada servicio
3. Configura el archivo .env (líneas 403-412)
4. Implementa tracking en tu código
5. Configura dashboards y reportes
6. Testea la integración completa

### **📈 Métricas Disponibles**
- User analytics (DAU, MAU, retention)
- Product metrics (feature adoption, usage)
- Business KPIs (revenue, growth, ROI)
- Custom events y funnels
- Real-time analytics y reporting

**📊 ANALYTICS & BUSINESS INTELLIGENCE CONFIGURADO PARA AIGESTION! 🚀**

---

*Última actualización: 24 de febrero de 2026*
*Versión: 1.0.0*
*Todos los archivos guardados en `c:\Users\Alejandro\AIGestion\scripts\setup\`*
