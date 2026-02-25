# 📊 Analytics & Business Intelligence Setup Guide for AIGestion

## 📋 **RESUMEN DE SERVICIOS**

### **Analytics Platforms**
- **Mixpanel** - Product analytics y user behavior
- **Amplitude** - User behavior tracking avanzado
- **Segment** - Customer data platform
- **Looker** - BI & data visualization
- **Tableau** - Advanced analytics y dashboards
- **Metabase** - Open-source BI platform

---

## 🚀 **CONFIGURACIÓN PASO A PASO**

### **1. Mixpanel Setup**

#### **Crear Cuenta Mixpanel**
```bash
# 1. Ve a https://mixpanel.com
# 2. Sign up o login
# 3. Crea nuevo proyecto "AIGestion"
# 4. Obtén el Project Token
```

#### **Obtener Mixpanel Token**
```bash
# En Mixpanel Dashboard:
# Settings → Project → Project Token
# Copia el token (ej: abc123def456ghi789)
```

#### **Configuración en Código**
```javascript
// Configuración Mixpanel
import mixpanel from 'mixpanel-browser';

mixpanel.init('YOUR_MIXPANEL_TOKEN', {
  debug: true,
  track_pageview: true,
  persistence: 'localStorage'
});

// Event tracking
mixpanel.track('User Signup', {
  'Source': 'Landing Page',
  'Plan': 'Premium'
});
```

### **2. Amplitude Setup**

#### **Crear Cuenta Amplitude**
```bash
# 1. Ve a https://amplitude.com
# 2. Sign up o login
# 3. Crea nuevo proyecto "AIGestion"
# 4. Obtén el API Key
```

#### **Obtener Amplitude API Key**
```bash
# En Amplitude Dashboard:
# Settings → Projects → API Keys
# Copia la API Key (ej: abc123def456ghi789)
```

#### **Configuración en Código**
```javascript
// Configuración Amplitude
import amplitude from 'amplitude-js';

amplitude.getInstance().init('YOUR_AMPLITUDE_API_KEY');

// Event tracking
amplitude.getInstance().logEvent('PAGE_VIEW', {
  'page': 'dashboard',
  'user_type': 'premium'
});
```

### **3. Segment Setup**

#### **Crear Cuenta Segment**
```bash
# 1. Ve a https://segment.com
# 2. Sign up o login
# 3. Crea nuevo workspace "AIGestion"
# 4. Obtén el Write Key
```

#### **Obtener Segment Write Key**
```bash
# En Segment Dashboard:
# Settings → Keys → Write Key
# Copia la Write Key (ej: abc123def456ghi789)
```

#### **Configuración en Código**
```javascript
// Configuración Segment
import analytics from 'analytics.js';

analytics.load('YOUR_SEGMENT_WRITE_KEY');

// Event tracking
analytics.track('Button Clicked', {
  button: 'signup',
  location: 'hero'
});
```

### **4. Looker Setup**

#### **Crear Cuenta Looker**
```bash
# 1. Ve a https://looker.com
# 2. Sign up o login
# 3. Crea nuevo proyecto "AIGestion"
# 4. Obtén el API Key
```

#### **Obtener Looker API Key**
```bash
# En Looker Admin:
# Admin → Users → API Keys
# Generar nueva API Key
# Copiar la API Key (ej: abc123def456ghi789)
```

#### **Configuración en Código**
```javascript
// Configuración Looker
const looker = require('@looker/sdk');

const sdk = looker.LookerSDK.createClient({
  base_url: 'https://yourcompany.looker.com',
  client_id: 'YOUR_CLIENT_ID',
  client_secret: 'YOUR_CLIENT_SECRET',
  api_version: '4.0'
});
```

### **5. Tableau Setup**

#### **Crear Cuenta Tableau**
```bash
# 1. Ve a https://tableau.com
# 2. Sign up o login
# 3. Crea nuevo sitio "AIGestion"
# 4. Obtén el API Key
```

#### **Obtener Tableau API Key**
```bash
# En Tableau Server:
# Settings → API Keys
# Generar nueva API Key
# Copiar la API Key (ej: abc123def456ghi789)
```

#### **Configuración en Código**
```javascript
// Configuración Tableau
const tableau = require('tableau-api-node');

const serverConnection = new tableau.ServerConnection();
serverConnection.connectAsync({
  version: '2.8',
  auth: {
    credentials: {
      name: 'YOUR_USERNAME',
      password: 'YOUR_PASSWORD',
      site: {
        contentUrl: 'AIGestion'
      }
    }
  }
});
```

### **6. Metabase Setup**

#### **Instalar Metabase**
```bash
# Opción 1: Docker
docker run -d -p 3000:3000 --name metabase metabase/metabase

# Opción 2: Descargar JAR
wget https://downloads.metabase.com/v0.46.0/metabase.jar
java -jar metabase.jar
```

#### **Configurar Metabase**
```bash
# 1. Accede a http://localhost:3000
# 2. Configura admin user
# 3. Conecta base de datos (PostgreSQL, MySQL, etc.)
# 4. Obtén el Secret Key
```

#### **Obtener Metabase Secret Key**
```bash
# En Metabase Admin:
# Admin → Settings → Authentication
# Generar nuevo Secret Key
# Copiar la Secret Key (ej: abc123def456ghi789)
```

#### **Configuración en Código**
```javascript
// Configuración Metabase
const Metabase = require('metabase-api');

const metabase = new Metabase({
  host: 'localhost',
  username: 'admin@metabase.com',
  password: 'password',
  database: 'aigestion_db'
});
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

## 🛠️ **SCRIPT AUTOMATIZADO**

### **PowerShell Script para Analytics Setup**
```powershell
# get-analytics-credentials.ps1
param(
    [Parameter(Mandatory=$false)]
    [switch]$Interactive,
    
    [Parameter(Mandatory=$false)]
    [switch]$Test
)

# Función para obtener credenciales de cada servicio
function Get-AnalyticsCredentials {
    Write-Host "📊 Analytics & Business Intelligence Setup" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Blue
    
    # Mixpanel
    $mixpanelToken = Read-Host "Ingresa tu Mixpanel Token"
    
    # Amplitude
    $amplitudeKey = Read-Host "Ingresa tu Amplitude API Key"
    
    # Segment
    $segmentKey = Read-Host "Ingresa tu Segment Write Key"
    
    # Looker
    $lookerKey = Read-Host "Ingresa tu Looker API Key"
    
    # Tableau
    $tableauKey = Read-Host "Ingresa tu Tableau API Key"
    
    # Metabase
    $metabaseKey = Read-Host "Ingresa tu Metabase Secret Key"
    
    # Actualizar archivo .env
    Update-EnvFile $mixpanelToken $amplitudeKey $segmentKey $lookerKey $tableauKey $metabaseKey
}

function Update-EnvFile {
    param(
        [string]$MixpanelToken,
        [string]$AmplitudeKey,
        [string]$SegmentKey,
        [string]$LookerKey,
        [string]$TableauKey,
        [string]$MetabaseKey
    )
    
    $envPath = ".\.env"
    $envContent = Get-Content $envPath -Raw
    
    # Reemplazar credenciales
    $envContent = $envContent -replace "# MIXPANEL_TOKEN=", "MIXPANEL_TOKEN=$MixpanelToken"
    $envContent = $envContent -replace "# AMPLITUDE_API_KEY=", "AMPLITUDE_API_KEY=$AmplitudeKey"
    $envContent = $envContent -replace "# SEGMENT_WRITE_KEY=", "SEGMENT_WRITE_KEY=$SegmentKey"
    $envContent = $envContent -replace "# LOOKER_API_KEY=", "LOOKER_API_KEY=$LookerKey"
    $envContent = $envContent -replace "# TABLEAU_API_KEY=", "TABLEAU_API_KEY=$TableauKey"
    $envContent = $envContent -replace "# METABASE_SECRET_KEY=", "METABASE_SECRET_KEY=$MetabaseKey"
    
    Set-Content -Path $envPath -Value $envContent -Encoding UTF8
    Write-Host "✅ Archivo .env actualizado exitosamente" -ForegroundColor Green
}

# Ejecutar
if ($Test) {
    Write-Host "🧪 Modo de prueba activado" -ForegroundColor Yellow
    Write-Host "Verificando configuración..." -ForegroundColor Blue
    # Test logic here
} else {
    Get-AnalyticsCredentials
}
```

---

## 🔧 **INTEGRACIÓN CON AIGESTION**

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

## 📊 **DASHBOARDS Y REPORTES**

### **Mixpanel Dashboard**
- **User Activity**: Daily active users, retention
- **Feature Usage**: Most used features, user flows
- **Conversion**: Signup funnel, conversion rates
- **Performance**: Page load times, error rates

### **Amplitude Dashboard**
- **User Behavior**: Session duration, page views
- **Cohort Analysis**: User retention by cohort
- **Funnel Analysis**: Conversion funnels
- **A/B Testing**: Experiment results

### **Looker Dashboard**
- **Business Metrics**: Revenue, growth, churn
- **User Analytics**: Demographics, behavior
- **Product Metrics**: Feature adoption, usage
- **Financial Analytics**: ROI, LTV, CAC

### **Tableau Dashboard**
- **Advanced Analytics**: Complex data visualizations
- **Custom Reports**: Tailored business insights
- **Data Exploration**: Interactive data analysis
- **Executive Dashboards**: High-level metrics

### **Metabase Dashboard**
- **Open Source BI**: Free analytics platform
- **SQL Queries**: Direct database queries
- **Custom Visualizations**: Flexible charting
- **Team Collaboration**: Shared dashboards

---

## 📈 **MÉTRICAS CLAVE PARA AIGESTION**

### **User Metrics**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- User Retention Rate
- Churn Rate
- Customer Lifetime Value (LTV)

### **Product Metrics**
- Feature Adoption Rate
- Session Duration
- Page Views per Session
- Conversion Rate
- Error Rate

### **Business Metrics**
- Revenue Growth
- Customer Acquisition Cost (CAC)
- Return on Investment (ROI)
- Average Revenue Per User (ARPU)
- Net Promoter Score (NPS)

---

## 🎯 **IMPLEMENTACIÓN RECOMENDADA**

### **Fase 1: Analytics Básicos (Semana 1)**
1. **Mixpanel** - Product analytics básicos
2. **Amplitude** - User behavior tracking
3. **Event tracking** en componentes clave

### **Fase 2: Data Platform (Semana 2)**
1. **Segment** - Customer data platform
2. **Data collection** centralizada
3. **User profiling** avanzado

### **Fase 3: BI & Visualization (Semana 3)**
1. **Looker** - Business intelligence
2. **Tableau** - Advanced analytics
3. **Executive dashboards**

### **Fase 4: Open Source (Semana 4)**
1. **Metabase** - Self-service analytics
2. **Custom queries** y reportes
3. **Team collaboration**

---

## 🔐 **SEGURIDAD Y PRIVACIDAD**

### **Data Protection**
- **GDPR Compliance**: Consent management
- **Data Anonymization**: User privacy protection
- **Data Retention**: Automatic data cleanup
- **Access Control**: Role-based permissions

### **Security Measures**
- **API Key Rotation**: Regular key updates
- **Encryption**: Data encryption in transit
- **Audit Logs**: Access tracking
- **Rate Limiting**: API usage limits

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

---

## 🎉 **RESUMEN FINAL**

Con esta guía completa tienes todo lo necesario para configurar 6 plataformas de analytics y business intelligence para AIGestion:

### **📊 6 Servicios Configurados**
- ✅ **Mixpanel** - Product analytics
- ✅ **Amplitude** - User behavior tracking
- ✅ **Segment** - Customer data platform
- ✅ **Looker** - BI & data visualization
- ✅ **Tableau** - Advanced analytics
- ✅ **Metabase** - Open-source BI

### **🚀 Implementación Completa**
1. **Crea cuentas** en cada plataforma
2. **Obtén credenciales** (API Keys, Tokens)
3. **Configura archivo .env** (líneas 403-412)
4. **Implementa tracking** en el código
5. **Configura dashboards** y reportes
6. **Testea integración** completa

### **📈 Métricas Disponibles**
- User analytics (DAU, MAU, retention)
- Product metrics (feature adoption, usage)
- Business KPIs (revenue, growth, ROI)
- Custom events y funnels

**📊 ANALYTICS & BUSINESS INTELLIGENCE CONFIGURADO PARA AIGESTION! 🚀**

---

*Última actualización: 24 de febrero de 2026*
*Versión: 1.0.0*
