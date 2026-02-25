# 📱 Meta Platform Setup Guide for AIGestion

## 📋 Overview

Guía completa para la configuración de Meta Platform (Facebook, Instagram, WhatsApp) en AIGestion. Esta guía te permitirá integrar las 3 plataformas principales de Meta para marketing, comunicación y análisis social media.

## 🎯 Servicios Soportados

### 1. **Meta App** 🏢
- **Tipo**: Aplicación Central y Autenticación
- **Uso**: Punto central para todas las integraciones de Meta
- **Integración**: OAuth 2.0, Graph API, Webhooks

### 2. **Facebook** 📘
- **Tipo**: Social Media & Marketing Platform
- **Uso**: Publicación de contenido, análisis de engagement
- **Integración**: Graph API, Pages API, Marketing API

### 3. **Instagram** 📷
- **Tipo**: Visual Content & Stories Platform
- **Uso**: Publicación visual, stories, reels, insights
- **Integración**: Instagram Basic Display, Instagram Graph API

### 4. **WhatsApp** 💬
- **Tipo**: Business Messaging Platform
- **Uso**: Comunicación con clientes, notificaciones, soporte
- **Integración**: WhatsApp Business API, Cloud API

## 🚀 Configuración Rápida

### Opción 1: Automática (Recomendada)

```powershell
# Ejecutar script automatizado
.\scripts\setup\get-meta-platform-credentials.ps1 -Mode interactive

# Modo Dios (configuración completa)
.\scripts\setup\get-meta-platform-credentials.ps1 -Mode god

# Modo batch para todos los servicios
.\scripts\setup\get-meta-platform-credentials.ps1 -Mode batch -Service all
```

### Opción 2: Manual

1. **Copia las credenciales** del template `meta-platform-credentials-template.txt`
2. **Pégalas en tu archivo `.env`**
3. **Reemplaza los valores de ejemplo** con tus credenciales reales
4. **Ejecuta el test de validación**:
   ```powershell
   .\scripts\setup\get-meta-platform-credentials.ps1 -Mode test
   ```

## 🔥 MODO DIOS - Configuración Extrema

El Modo Dios de AIGestion para Meta Platform incluye:

### 🎮 Características Extremas
- **Control total** de Meta Platform desde AIGestion
- **IA para contenido viral** y marketing predictivo
- **Sincronización automática** en tiempo real
- **Dashboard unificado** de social media
- **Publicación programada** inteligente
- **Análisis competitivo** avanzado
- **Segmentación predictiva** de audiencia
- **Campañas automatizadas** con IA

### ⚡ Activación

```powershell
# Activar Modo Dios
.\scripts\setup\get-meta-platform-credentials.ps1 -Mode god

# Verificar configuración
.\scripts\setup\get-meta-platform-credentials.ps1 -Mode test
```

## 📋 Guías Detalladas por Servicio

### 🏢 Meta App Setup

#### 1. Crear Aplicación en Meta Developers
1. Ve a [Meta Developers](https://developers.facebook.com/)
2. Click "Create App" → "Business"
3. **Nombre de la app**: "AIGestion Social Media"
4. **Email de contacto**: admin@aigestion.net
5. **Selecciona productos**: "WhatsApp", "Instagram Basic Display", "Facebook Login"

#### 2. Configurar Permisos y Scopes
```json
{
  "permissions": [
    "pages_read_engagement",
    "pages_manage_posts",
    "pages_manage_engagement",
    "instagram_basic",
    "instagram_content",
    "instagram_insights",
    "whatsapp_business_messaging",
    "business_management"
  ]
}
```

#### 3. Obtener Credenciales
1. **App ID**: Visible en el dashboard de la app
2. **App Secret**: En "Settings" → "Basic" → "App Secret"
3. **Access Token**: En "Tools" → "Graph API Explorer"

#### 4. Configurar Webhooks
```bash
# Webhook URL para todos los servicios
WEBHOOK_URL=https://aigestion.net/api/webhooks/meta
VERIFY_TOKEN=aigestion_meta_webhook_2026

# Suscribir a eventos:
# - page_leadgen (Facebook)
# - instagram_mentions (Instagram)
# - whatsapp_business_messages (WhatsApp)
```

#### 5. Configurar Variables
```bash
META_APP_ID=1234567890123456
META_APP_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
META_ACCESS_TOKEN=EAAJZCJ6example1234567890abcdef1234567890
```

### 📘 Facebook Setup

#### 1. Crear Página de Facebook
1. Ve a [Facebook Pages](https://facebook.com/pages/creation)
2. **Nombre**: "AIGestion"
3. **Categoría**: "Technology Company"
4. **Descripción**: "Inteligencia Artificial revolucionaria"

#### 2. Conectar Página a App Meta
1. En Meta Developers → "Instagram Basic Display"
2. Click "Add New Test User" o "Add Instagram Account"
3. **Selecciona tu página** de Facebook
4. **Autoriza los permisos** necesarios

#### 3. Generar Page Access Token
1. Ve a [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. **Selecciona tu App** de AIGestion
3. **Selecciona "Page Access Token"**
4. **Permisos**: `pages_read_engagement`, `pages_manage_posts`, `pages_manage_engagement`
5. **Genera el token** y cópialo

#### 4. Obtener Page ID
```bash
# Método 1: Desde URL de Facebook
# https://facebook.com/PAGE-NAME
# PAGE-NAME es el Page ID si es numérico

# Método 2: Graph API
GET /me/accounts
# Devuelve lista de páginas con sus IDs
```

#### 5. Configurar Variables
```bash
FACEBOOK_PAGE_ID=1234567890123456
FACEBOOK_PAGE_ACCESS_TOKEN=EAAJZCJ6example1234567890abcdef1234567890
```

### 📷 Instagram Setup

#### 1. Convertir a Cuenta Business
1. Ve a [Instagram](https://instagram.com/)
2. **Settings** → **Account** → **Switch to Professional Account**
3. **Selecciona "Business"**
4. **Conecta tu página de Facebook**

#### 2. Vincular Cuenta a App Meta
1. En Meta Developers → "Instagram Basic Display"
2. **Click "Add Instagram Account"**
3. **Inicia sesión** con tu cuenta business
4. **Autoriza los permisos** necesarios

#### 3. Generar Access Token
1. **Basic Display** → "Generate Token"
2. **Permisos**: `instagram_basic`, `instagram_content`, `instagram_insights`
3. **Copia el token** generado

#### 4. Obtener Business IDs
```bash
# Método 1: Graph API
GET /me?fields=id,username,account_type,business_discovery
# Devuelve business_id y business_account_id

# Método 2: Instagram Settings
# Perfil → Settings → Professional → Business Information
```

#### 5. Configurar Variables
```bash
INSTAGRAM_ACCESS_TOKEN=EAAJZCJ6example1234567890abcdef1234567890
INSTAGRAM_BUSINESS_ID=1234567890123456
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841405833148720
```

### 💬 WhatsApp Setup

#### 1. Configurar WhatsApp Business API
1. En Meta Developers → "WhatsApp" → "Get Started"
2. **Selecciona tu número de teléfono**
3. **Verifica el número** con código SMS
4. **Configura el perfil de negocio**

#### 2. Generar Token de API
1. **WhatsApp API Configuration** → "Generate Token"
2. **Copia el token** de acceso permanente
3. **Guarda de forma segura**

#### 3. Obtener Business Phone ID
```bash
# Método 1: WhatsApp Manager
# Dashboard → Phone Numbers → Select Number → Phone Number ID

# Método 2: Graph API
GET /whatsapp_business/account
# Devuelve business_phone_id
```

#### 4. Configurar Webhook
```bash
# En WhatsApp Manager
# Webhook URL: https://aigestion.net/api/webhooks/whatsapp
# Verify Token: aigestion_whatsapp_verify_2026

# Eventos a suscribir:
# - messages
# - message_reactions
# - message_status
```

#### 5. Configurar Variables
```bash
WHATSAPP_TOKEN=EAAJZCJ6example1234567890abcdef1234567890
WHATSAPP_VERIFY_TOKEN=aigestion_whatsapp_verify_2026
WHATSAPP_BUSINESS_PHONE_ID=1234567890123456
```

## 🔧 Integración con AIGestion

### 1. Instalación de Dependencias

```bash
npm install @facebook/graph-api instagram-basic-display whatsapp-business-api
```

### 2. Configuración del Servicio

```typescript
// src/services/meta-platform-manager.ts
import { FacebookAPI } from '@facebook/graph-api';
import { InstagramAPI } from 'instagram-basic-display';
import { WhatsAppAPI } from 'whatsapp-business-api';

export class MetaPlatformManager {
  private facebook: FacebookAPI;
  private instagram: InstagramAPI;
  private whatsapp: WhatsAppAPI;

  constructor() {
    this.facebook = new FacebookAPI({
      appId: process.env.META_APP_ID,
      appSecret: process.env.META_APP_SECRET,
      pageId: process.env.FACEBOOK_PAGE_ID,
      pageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    });

    this.instagram = new InstagramAPI({
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
      businessId: process.env.INSTAGRAM_BUSINESS_ID,
      businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
    });

    this.whatsapp = new WhatsAppAPI({
      token: process.env.WHATSAPP_TOKEN,
      businessPhoneId: process.env.WHATSAPP_BUSINESS_PHONE_ID,
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN
    });
  }

  // Publicación multiplataforma
  async publishMultiPlatform(content: any, platforms: string[]) {
    const results = [];

    if (platforms.includes('facebook')) {
      results.push(await this.facebook.createPost(content));
    }

    if (platforms.includes('instagram')) {
      results.push(await this.instagram.createMedia(content));
    }

    return results;
  }

  // Análisis unificado
  async getUnifiedAnalytics(period: string) {
    const [fbAnalytics, igAnalytics, waAnalytics] = await Promise.all([
      this.facebook.getInsights({ period }),
      this.instagram.getInsights({ period }),
      this.whatsapp.getMetrics({ period })
    ]);

    return {
      facebook: fbAnalytics,
      instagram: igAnalytics,
      whatsapp: waAnalytics,
      total: this.calculateTotalMetrics(fbAnalytics, igAnalytics, waAnalytics)
    };
  }
}

export default new MetaPlatformManager();
```

### 3. Dashboard Unificado

```typescript
// src/components/MetaPlatformDashboard.tsx
import { useEffect, useState } from 'react';
import metaManager from '@/services/meta-platform-manager';

export default function MetaPlatformDashboard() {
  const [analytics, setAnalytics] = useState({
    facebook: { impressions: 0, engagement: 0, reach: 0 },
    instagram: { impressions: 0, engagement: 0, reach: 0 },
    whatsapp: { sent: 0, delivered: 0, read: 0 }
  });

  useEffect(() => {
    async function fetchData() {
      const data = await metaManager.getUnifiedAnalytics('last_30_days');
      setAnalytics(data);
    }
    fetchData();
    
    // Actualización cada 5 minutos
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleMultiPlatformPublish = async (content: any) => {
    await metaManager.publishMultiPlatform(content, ['facebook', 'instagram']);
    // Refrescar analytics
    fetchData();
  };

  return (
    <div className="meta-platform-dashboard">
      <div className="analytics-grid">
        <div className="platform-card facebook">
          <h3>📘 Facebook</h3>
          <div className="metrics">
            <div className="metric">
              <span className="label">Impresiones</span>
              <span className="value">{analytics.facebook.impressions.toLocaleString()}</span>
            </div>
            <div className="metric">
              <span className="label">Engagement</span>
              <span className="value">{analytics.facebook.engagement.toLocaleString()}</span>
            </div>
            <div className="metric">
              <span className="label">Reach</span>
              <span className="value">{analytics.facebook.reach.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="platform-card instagram">
          <h3>📷 Instagram</h3>
          <div className="metrics">
            <div className="metric">
              <span className="label">Impresiones</span>
              <span className="value">{analytics.instagram.impressions.toLocaleString()}</span>
            </div>
            <div className="metric">
              <span className="label">Engagement</span>
              <span className="value">{analytics.instagram.engagement.toLocaleString()}</span>
            </div>
            <div className="metric">
              <span className="label">Reach</span>
              <span className="value">{analytics.instagram.reach.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="platform-card whatsapp">
          <h3>💬 WhatsApp</h3>
          <div className="metrics">
            <div className="metric">
              <span className="label">Enviados</span>
              <span className="value">{analytics.whatsapp.sent.toLocaleString()}</span>
            </div>
            <div className="metric">
              <span className="label">Entregados</span>
              <span className="value">{analytics.whatsapp.delivered.toLocaleString()}</span>
            </div>
            <div className="metric">
              <span className="label">Leídos</span>
              <span className="value">{analytics.whatsapp.read.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="publish-section">
        <h2>📤 Publicación Multiplataforma</h2>
        <PublishForm onPublish={handleMultiPlatformPublish} />
      </div>
    </div>
  );
}
```

## 📊 Estrategias de Contenido

### 📈 Tipos de Contenido por Plataforma

#### Facebook
- **Posts educativos**: Tutoriales de IA, explicaciones técnicas
- **Casos de éxito**: Historias de clientes transformados
- **Eventos**: Webinars, lanzamientos, conferencias
- **Infografías**: Datos y estadísticas sobre IA

#### Instagram
- **Stories detrás de cámaras**: Día en AIGestion
- **Reels**: Demostraciones rápidas de IA en acción
- **Carrousel**: Tutoriales paso a paso
- **IGTV**: Videos largos explicativos

#### WhatsApp
- **Notificaciones personalizadas**: Actualizaciones de proyectos
- **Soporte al cliente**: Respuestas rápidas
- **Mensajes de bienvenida**: Onboarding automatizado
- **Alertas importantes**: Cambios de servicio, mantenimiento

### 🎯 Calendario de Contenido

```typescript
// Ejemplo de calendario automatizado
const contentCalendar = {
  monday: {
    facebook: 'Técnico Tuesday: Explicación de algoritmos de IA',
    instagram: 'Reel: Demostración rápida de nueva feature',
    whatsapp: 'Mensaje motivacional semanal'
  },
  wednesday: {
    facebook: 'Caso de éxito: Cliente transformado con IA',
    instagram: 'Carousel: Antes y después de implementación',
    whatsapp: 'Recordatorio de webinar del viernes'
  },
  friday: {
    facebook: 'Live Q&A: Preguntas sobre IA',
    instagram: 'Story: Behind the scenes del equipo',
    whatsapp: 'Resumen semanal y próximos pasos'
  }
};
```

## 🔄 Automatización Avanzada

### 1. Publicación Programada Inteligente
```typescript
// Sistema de publicación optimizada por IA
class IntelligentPublisher {
  async scheduleContent(content: any) {
    // Análisis de audiencia activa
    const audienceInsights = await this.getAudienceInsights();
    
    // Predicción de mejor hora
    const optimalTime = await this.predictOptimalTime(audienceInsights);
    
    // Generación de variaciones
    const variations = await this.generateVariations(content);
    
    // Programación multiplataforma
    return await this.scheduleMultiPlatform(variations, optimalTime);
  }
}
```

### 2. Respuesta Automática Inteligente
```typescript
// Sistema de respuestas automáticas con IA
class AutoReplySystem {
  async generateResponse(message: string, platform: string) {
    // Análisis de sentimiento
    const sentiment = await this.analyzeSentiment(message);
    
    // Clasificación de intención
    const intent = await this.classifyIntent(message);
    
    // Generación de respuesta contextual
    const response = await this.generateContextualResponse(intent, sentiment, platform);
    
    return response;
  }
}
```

### 3. Análisis Competitivo
```typescript
// Monitoreo de competencia
class CompetitorAnalysis {
  async trackCompetitors() {
    const competitors = ['competitor1', 'competitor2', 'competitor3'];
    
    for (const competitor of competitors) {
      const metrics = await this.getCompetitorMetrics(competitor);
      await this.analyzeStrategy(metrics);
      await this.generateRecommendations(metrics);
    }
  }
}
```

## 🎮 Gamificación del Social Media

### Sistema de Puntos
- **Publicación viral**: 50 puntos por post >10k interacciones
- **Engagement alto**: 20 puntos por post >5% engagement
- **Contenido creativo**: 30 puntos por contenido innovador
- **Respuesta rápida**: 10 puntos por respuesta <1 hora

### Logros y Badges
- **🚀 Content Creator**: 100 posts publicados
- **🌟 Viral Master**: 5 posts virales
- **💬 Engagement King**: 1000 comentarios respondidos
- **📊 Analytics Guru**: Análisis predictivo preciso

### Leaderboards
- **Semanal**: Mayor engagement
- **Mensual**: Mejor contenido creativo
- **Trimestral**: Crecimiento de seguidores
- **Anual**: Mejor ROI de marketing

## 🛡️ Seguridad y Cumplimiento

### Configuración de Seguridad
```yaml
# security.yaml
meta_security:
  # Encriptación de tokens
  token_encryption: AES-256
  
  # Rate limiting
  rate_limits:
    facebook: 100_requests_per_hour
    instagram: 200_requests_per_hour
    whatsapp: 1000_messages_per_day
  
  # Auditoría
  audit_logging: true
  access_monitoring: true
  
  # Cumplimiento
  gdpr_compliant: true
  ccpa_compliant: true
  data_retention: 90_days
```

### Monitoreo de Seguridad
```typescript
// Sistema de monitoreo de seguridad
class SecurityMonitor {
  async monitorAccess() {
    // Detección de accesos sospechosos
    const suspiciousActivity = await this.detectSuspiciousActivity();
    
    if (suspiciousActivity) {
      await this.alertSecurityTeam(suspiciousActivity);
      await this.revokeTokens(suspiciousActivity.userId);
    }
  }
}
```

## 📱 Notificaciones Inteligentes

### Tipos de Notificaciones
- **Engagement**: Posts con alto rendimiento
- **Seguridad**: Accesos sospechosos o cambios
- **Rendimiento**: Métricas fuera de rango
- **Oportunidades**: Tendencias emergentes

### Configuración
```typescript
// Sistema de notificaciones inteligentes
class NotificationSystem {
  async sendNotification(type: string, data: any) {
    const channels = await this.getOptimalChannels(type);
    
    for (const channel of channels) {
      await this.sendToChannel(channel, {
        type,
        data,
        priority: this.calculatePriority(type, data),
        template: await this.getTemplate(type, data)
      });
    }
  }
}
```

## 🚀 God Mode Features

### IA Predictiva Avanzada
- **Predicción de viralidad**: Análisis de contenido antes de publicar
- **Optimización de horarios**: IA para determinar mejores momentos
- **Segmentación predictiva**: Audiencia basada en comportamiento futuro
- **Análisis de sentimiento profundo**: Emociones y matices

### Automatización Extrema
- **Contenido generado por IA**: Posts, imágenes, videos
- **Campañas autónomas**: Creación y optimización automática
- **Respuestas contextuales**: IA que entiende el contexto
- **Análisis competitivo en tiempo real**: Monitoreo continuo

### Dashboard Cósmico
- **Visualización 3D**: Métricas en espacio tridimensional
- **Real-time holograms**: Proyección futurista de datos
- **Voice interface**: Control completamente por voz
- **AR integration**: Ver métricas en realidad aumentada

## 📚 Recursos Adicionales

### Documentación
- [Meta Graph API](https://developers.facebook.com/docs/graph-api)
- [Instagram API](https://developers.facebook.com/docs/instagram-api)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Meta Marketing API](https://developers.facebook.com/docs/marketing-api)

### Tutoriales
- [Video: Meta App Setup](https://aigestion.net/tutorials/meta-app-setup)
- [Video: Facebook Marketing](https://aigestion.net/tutorials/facebook-marketing)
- [Video: Instagram Business](https://aigestion.net/tutorials/instagram-business)
- [Video: WhatsApp Business](https://aigestion.net/tutorials/whatsapp-business)

### Herramientas
- [Meta Business Suite](https://business.facebook.com/)
- [Facebook Creator Studio](https://business.facebook.com/creatorstudio/)
- [Instagram Insights](https://business.instagram.com/insights)
- [WhatsApp Manager](https://business.facebook.com/whatsapp)

## 🧪 Testing y Validación

### Test de Conexión
```bash
# Ejecutar test completo
npm run test:meta-connections

# Test individual
npm run test:facebook-api
npm run test:instagram-api
npm run test:whatsapp-api
npm run test:webhooks
```

### Test de Funcionalidad
```bash
# Test publicación
npm run test:meta-publishing

# Test analytics
npm run test:meta-analytics

# Test automations
npm run test:meta-automations

# Test God Mode
npm run test:meta-god-mode
```

## 🆘 Soporte y Troubleshooting

### Problemas Comunes

#### 1. Error de Token Expirado
```bash
# Verificar validez del token
curl "https://graph.facebook.com/me?access_token=YOUR_TOKEN"

# Generar nuevo token
# Meta Developers → Tools → Graph API Explorer
```

#### 2. Permisos Insuficientes
```bash
# Revisar permisos actuales
curl "https://graph.facebook.com/me/permissions?access_token=YOUR_TOKEN"

# Solicitar permisos adicionales
# Meta Developers → App Review → Permissions
```

#### 3. Webhook No Responde
```bash
# Verificar configuración de webhook
curl -X POST "https://aigestion.net/api/webhooks/meta" \
  -H "Content-Type: application/json" \
  -d '{"object": "page", "entry": [{"id": "test"}]}'
```

#### 4. Rate Limiting
```bash
# Verificar límites de uso
curl "https://graph.facebook.com/v18.0/me/usage?access_token=YOUR_TOKEN"

# Implementar backoff exponencial
# Esperar tiempo creciente entre requests fallidos
```

### Contacto Soporte
- **Email**: soporte@aigestion.net
- **Chat**: https://aigestion.net/support
- **Priority Support**: Disponible en God Mode
- **Emergency**: 24/7 para sistemas críticos

## 📈 Roadmap Futuro

### Q1 2024
- [ ] Integración con Threads de Meta
- [ ] Soporte para Facebook Shops
- [ ] Instagram Shopping avanzado
- [ ] WhatsApp Flows mejorados

### Q2 2024
- [ ] IA generativa de contenido
- [ ] Real-time collaboration
- [ ] Advanced analytics con ML
- [ ] Cross-platform optimization

### Q3 2024
- [ ] Metaverse integration
- [ ] AR/VR content creation
- [ ] Neural interface (concepto)
- [ ] Quantum social media (futuro)

## ✅ Checklist Final

- [ ] **Configurar Meta App** con todos los permisos
- [ ] **Crear página de Facebook** y conectarla
- [ ] **Convertir Instagram** a cuenta business
- [ ] **Configurar WhatsApp Business** API
- [ ] **Generar todos los tokens** de acceso
- [ ] **Configurar webhooks** para cada plataforma
- [ ] **Ejecutar test de validación**
- [ ] **Probar publicación multiplataforma**
- [ ] **Configurar dashboard unificado**
- [ ] **Activar automatizaciones inteligentes**
- [ ] **Documentar procesos internos**
- [ ] **Capacitar al equipo**

---

## 🎉 ¡Listo para Usar!

Una vez completada la configuración, tendrás acceso a:

- **Control total** de Facebook, Instagram, WhatsApp desde AIGestion
- **Publicación multiplataforma** con un clic
- **Análisis unificado** en tiempo real
- **IA para contenido viral** y marketing predictivo
- **Automatización inteligente** de respuestas y campañas
- **Dashboard unificado** con métricas avanzadas
- **Seguridad enterprise** para todas las cuentas
- **Gamificación** para optimizar engagement

**¡AIGestion Meta Platform está 100% operativo y listo para dominar el social media! 📱**

---

*Última actualización: 24 de febrero de 2026*
*Versión: 2.0.0 - God Mode Edition*
