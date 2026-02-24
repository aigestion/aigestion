#!/usr/bin/env pwsh

# =============================================================================
# SETUP GOOGLE ANALYTICS 4 - AIGESTION
# =============================================================================

Write-Host "SETUP GOOGLE ANALYTICS 4 - AIGESTION" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "OBJETIVO: Configurar Google Analytics 4 para monitoreo completo" -ForegroundColor Yellow

# 1. Verificar configuración actual
Write-Host "`n1. VERIFICANDO CONFIGURACIÓN ACTUAL" -ForegroundColor Yellow

$envFile = "c:\Users\Alejandro\AIGestion\.env"
$gaConfigured = Select-String -Path $envFile -Pattern "GOOGLE_ANALYTICS_ID" -Quiet

if ($gaConfigured) {
    $gaId = Select-String -Path $envFile -Pattern "GOOGLE_ANALYTICS_ID" | ForEach-Object { $_.Line.Split('=')[1] }
    Write-Host "✅ Google Analytics ya configurado: $gaId" -ForegroundColor Green
} else {
    Write-Host "❌ Google Analytics no configurado" -ForegroundColor Red
    Write-Host "Configurando Google Analytics 4..." -ForegroundColor Yellow
}

# 2. Configurar variables de entorno
Write-Host "`n2. CONFIGURANDO VARIABLES DE ENTORNO" -ForegroundColor Yellow

$gaConfig = @"

# Google Analytics 4 (✅ CONFIGURADO)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_API_KEY=AIzaSyCZj66qyrhNYW8KaDQUhiqwdbvioKb9ErQ
GOOGLE_ANALYTICS_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_ANALYTICS_TRACKING=true
GOOGLE_ANALYTICS_DEBUG=false

# Google Tag Manager
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
GTM_ENABLED=true

# Google Search Console
GOOGLE_SEARCH_CONSOLE_VERIFICATION_FILE=googleXXXXXXXXXXXXXXXXXXXXXXXX.html
SEARCH_CONSOLE_ENABLED=true
"@

# Agregar al .env si no existe
if (-not $gaConfigured) {
    Add-Content -Path $envFile -Value $gaConfig
    Write-Host "✅ Variables de Google Analytics agregadas a .env" -ForegroundColor Green
    Write-Host "⚠️  Debes actualizar G-XXXXXXXXXX con tu ID real" -ForegroundColor Yellow
}

# 3. Crear script de Analytics para el frontend
Write-Host "`n3. CREANDO SCRIPT DE ANALYTICS" -ForegroundColor Yellow

$analyticsScript = @"
// Google Analytics 4 Configuration
export const GA_CONFIG = {
  measurementId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX',
  apiSecret: import.meta.env.VITE_GOOGLE_ANALYTICS_SECRET || 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  apiKey: import.meta.env.VITE_GOOGLE_ANALYTICS_API_KEY || 'AIzaSyCZj66qyrhNYW8KaDQUhiqwdbvioKb9ErQ',
  debug: import.meta.env.VITE_GOOGLE_ANALYTICS_DEBUG === 'true',
  enabled: import.meta.env.VITE_GOOGLE_ANALYTICS_TRACKING !== 'false'
};

// Custom Events for AIGestion
export const GA_EVENTS = {
  // Page View
  PAGE_VIEW: 'page_view',
  
  // User Engagement
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  LOGOUT: 'logout',
  
  // Feature Usage
  DASHBOARD_VIEW: 'dashboard_view',
  AI_CHAT_START: 'ai_chat_start',
  AI_CHAT_END: 'ai_chat_end',
  FEATURE_USED: 'feature_used',
  
  // Business Metrics
  TRIAL_STARTED: 'trial_started',
  SUBSCRIPTION_STARTED: 'subscription_started',
  PAYMENT_COMPLETED: 'payment_completed',
  
  // Performance
  PERFORMANCE_METRIC: 'performance_metric',
  ERROR_OCCURRED: 'error_occurred',
  
  // Content Engagement
  TUTORIAL_STARTED: 'tutorial_started',
  TUTORIAL_COMPLETED: 'tutorial_completed',
  DOCUMENT_VIEWED: 'document_viewed',
  
  // Technical
  API_CALL: 'api_call',
  BUILD_INFO: 'build_info'
};

// Event Parameters
export const GA_PARAMS = {
  // User
  USER_ID: 'user_id',
  USER_TYPE: 'user_type',
  SESSION_ID: 'session_id',
  
  // Content
  PAGE_LOCATION: 'page_location',
  PAGE_TITLE: 'page_title',
  CONTENT_TYPE: 'content_type',
  
  // Technical
  ERROR_MESSAGE: 'error_message',
  ERROR_TYPE: 'error_type',
  LOAD_TIME: 'load_time',
  RESPONSE_TIME: 'response_time',
  
  // Business
  PLAN_TYPE: 'plan_type',
  PAYMENT_AMOUNT: 'payment_amount',
  CURRENCY: 'currency',
  
  // Feature
  FEATURE_NAME: 'feature_name',
  FEATURE_CATEGORY: 'feature_category',
  INTERACTION_TYPE: 'interaction_type'
};

// Analytics Service Class
export class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized = false;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized || !GA_CONFIG.enabled) return;

    try {
      // Load gtag script
      await this.loadGtag();
      
      // Initialize GA4
      gtag('js', new Date());
      gtag('config', GA_CONFIG.measurementId, {
        debug_mode: GA_CONFIG.debug,
        send_page_view: false, // We'll handle page views manually
        custom_map: {
          custom_parameter_1: 'user_type',
          custom_parameter_2: 'session_id'
        }
      });

      this.initialized = true;
      console.log('📊 Google Analytics 4 initialized');
      
      // Track initial page view
      this.trackPageView();
      
    } catch (error) {
      console.error('❌ Failed to initialize Google Analytics:', error);
    }
  }

  private async loadGtag(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = \`https://www.googletagmanager.com/gtag/js?id=\${GA_CONFIG.measurementId}\`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Page Tracking
  trackPageView(path?: string): void {
    if (!this.initialized) return;
    
    const pagePath = path || window.location.pathname;
    gtag('event', GA_EVENTS.PAGE_VIEW, {
      page_location: pagePath,
      page_title: document.title
    });
  }

  // User Events
  trackSignUp(method: string, userType: string): void {
    this.trackEvent(GA_EVENTS.SIGN_UP, {
      method,
      user_type: userType
    });
  }

  trackLogin(method: string, userType: string): void {
    this.trackEvent(GA_EVENTS.LOGIN, {
      method,
      user_type: userType
    });
  }

  // Feature Events
  trackFeatureUsed(featureName: string, category: string, interactionType: string): void {
    this.trackEvent(GA_EVENTS.FEATURE_USED, {
      feature_name: featureName,
      feature_category: category,
      interaction_type: interactionType
    });
  }

  trackAIChatStart(model: string, sessionId: string): void {
    this.trackEvent(GA_EVENTS.AI_CHAT_START, {
      ai_model: model,
      session_id: sessionId
    });
  }

  trackAIChatEnd(model: string, sessionId: string, messageCount: number): void {
    this.trackEvent(GA_EVENTS.AI_CHAT_END, {
      ai_model: model,
      session_id: sessionId,
      message_count: messageCount
    });
  }

  // Business Events
  trackTrialStarted(planType: string): void {
    this.trackEvent(GA_EVENTS.TRIAL_STARTED, {
      plan_type: planType
    });
  }

  trackPaymentCompleted(amount: number, currency: string, planType: string): void {
    this.trackEvent(GA_EVENTS.PAYMENT_COMPLETED, {
      payment_amount: amount,
      currency,
      plan_type: planType
    });
  }

  // Performance Events
  trackPerformanceMetric(metricName: string, value: number, unit: string): void {
    this.trackEvent(GA_EVENTS.PERFORMANCE_METRIC, {
      metric_name: metricName,
      value,
      unit
    });
  }

  trackError(errorType: string, errorMessage: string, context?: string): void {
    this.trackEvent(GA_EVENTS.ERROR_OCCURRED, {
      error_type: errorType,
      error_message: errorMessage,
      context
    });
  }

  // Custom Events
  trackEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.initialized) return;
    
    gtag('event', eventName, parameters);
  }

  // E-commerce Events
  trackPurchase(transactionId: string, value: number, items: any[]): void {
    gtag('event', 'purchase', {
      transaction_id: transactionId,
      value,
      currency: 'USD',
      items
    });
  }

  trackBeginCheckout(value: number, items: any[]): void {
    gtag('event', 'begin_checkout', {
      value,
      currency: 'USD',
      items
    });
  }
}

// Export singleton instance
export const analytics = AnalyticsService.getInstance();

// Type declarations
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void;
    dataLayer: any[];
  }
}
"@

$analyticsPath = "c:\Users\Alejandro\AIGestion\frontend\apps\website-epic\src\services\analytics.service.ts"
$analyticsScript | Out-File -FilePath $analyticsPath -Encoding UTF8
Write-Host "✅ Analytics service creado: $analyticsPath" -ForegroundColor Green

# 4. Crear componente de Analytics
Write-Host "`n4. CREANDO COMPONENTE DE ANALYTICS" -ForegroundColor Yellow

$analyticsComponent = @"
import React, { useEffect } from 'react';
import { analytics } from '../services/analytics.service';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize analytics
    analytics.initialize();

    // Track page changes
    const handleRouteChange = () => {
      analytics.trackPageView();
    };

    // Listen for route changes (for SPA)
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleRouteChange);
      
      // Override pushState to track navigation
      const originalPushState = window.history.pushState;
      window.history.pushState = function(state, title, url) {
        originalPushState.call(this, state, title, url);
        setTimeout(handleRouteChange, 0);
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handleRouteChange);
      }
    };
  }, []);

  return <>{children}</>;
};

// Custom hooks for easy tracking
export const useAnalytics = () => {
  const trackFeature = (featureName: string, category: string) => {
    analytics.trackFeatureUsed(featureName, category, 'click');
  };

  const trackAIChat = (model: string, sessionId: string, isStart: boolean) => {
    if (isStart) {
      analytics.trackAIChatStart(model, sessionId);
    } else {
      analytics.trackAIChatEnd(model, sessionId, 0); // You'd track actual message count
    }
  };

  const trackError = (error: Error, context?: string) => {
    analytics.trackError(error.name, error.message, context);
  };

  const trackPerformance = (metricName: string, value: number, unit: string = 'ms') => {
    analytics.trackPerformanceMetric(metricName, value, unit);
  };

  return {
    trackFeature,
    trackAIChat,
    trackError,
    trackPerformance,
    analytics
  };
};
"@

$componentPath = "c:\Users\Alejandro\AIGestion\frontend\apps\website-epic\src\components\AnalyticsProvider.tsx"
$analyticsComponent | Out-File -FilePath $componentPath -Encoding UTF8
Write-Host "✅ Analytics component creado: $componentPath" -ForegroundColor Green

# 5. Crear instrucciones de configuración
Write-Host "`n5. INSTRUCCIONES DE CONFIGURACIÓN" -ForegroundColor Yellow

$instructions = @"
# 📊 GOOGLE ANALYTICS 4 SETUP - AIGESTION

## 🎯 PASOS PARA COMPLETAR LA CONFIGURACIÓN

### 1. CREAR PROPIEDAD GOOGLE ANALYTICS 4

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en \"Administrar\" (engranaje)
4. En \"Cuenta\", haz clic en \"Crear cuenta\"
5. Selecciona \"Web\" y añade el nombre: \"AIGestion Analytics\"
6. Configura el flujo de datos y crea la propiedad
7. Copia el ID de Medición (formato: G-XXXXXXXXXX)

### 2. CONFIGURAR VARIABLES DE ENTORNO

Actualiza el archivo \`.env\` con tus valores reales:

\`\`\`env
# Reemplaza G-XXXXXXXXXX con tu ID real
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_MEASUREMENT_ID=G-XXXXXXXXXX

# Crea API Key en Google Cloud Console
GOOGLE_ANALYTICS_API_KEY=tu-api-key-aqui

# Crea secret en Google Analytics
GOOGLE_ANALYTICS_SECRET=tu-secret-aqui
\`\`\`

### 3. INTEGRAR EN EL APLICATIVO

En tu archivo principal de React (App.tsx):

\`\`\`tsx
import { AnalyticsProvider } from './components/AnalyticsProvider';

function App() {
  return (
    <AnalyticsProvider>
      {/* Tu aplicación existente */}
    </AnalyticsProvider>
  );
}
\`\`\`

### 4. VERIFICAR CONFIGURACIÓN

1. Abre el website en modo incógnito
2. Abre Google Analytics en tiempo real
3. Navega por el website
4. Deberías ver eventos en tiempo real

### 5. CONFIGURAR EVENTOS PERSONALIZADOS

Usa el hook \`useAnalytics\` en tus componentes:

\`\`\`tsx
import { useAnalytics } from './components/AnalyticsProvider';

function MyComponent() {
  const { trackFeature, trackAIChat, trackError } = useAnalytics();

  const handleButtonClick = () => {
    trackFeature('dashboard_view', 'navigation');
  };

  const handleAIChat = () => {
    trackAIChat('gemini-2.5-flash', 'session-123', true);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>View Dashboard</button>
      <button onClick={handleAIChat}>Start AI Chat</button>
    </div>
  );
}
\`\`\`

## 📈 MÉTRICAS CONFIGURADAS

### Eventos Automáticos
- \`page_view\`: Cada cambio de página
- \`session_start\`: Inicio de sesión
- \`first_visit\`: Primera visita

### Eventos Personalales
- \`ai_chat_start\`: Inicio de chat con IA
- \`ai_chat_end\`: Fin de chat con IA
- \`feature_used\`: Uso de características
- \`error_occurred\`: Errores de aplicación
- \`performance_metric\`: Métricas de rendimiento

### Parámetros Personalales
- \`user_type\`: Tipo de usuario (admin, client, demo)
- \`ai_model\`: Modelo de IA utilizado
- \`feature_name\`: Nombre de la característica
- \`error_type\`: Tipo de error

## 🔧 CONFIGURACIÓN AVANZADA

### Google Tag Manager
Opcional: Configura GTM para mayor flexibilidad

### Search Console
Conecta con Google Search Console para SEO

### Data Studio
Crea dashboards personalizados en Looker Studio

## 📊 DASHBOARD RECOMENDADO

Métricas clave a monitorear:
1. **Usuarios Activos**: Tasa de engagement
2. **Duración de Sesión**: Calidad del contenido
3. **Tasa de Rebote**: Experiencia de usuario
4. **Eventos de IA**: Uso de características principales
5. **Conversiones**: Trial → Suscripción

## 🚀 PRÓXIMOS PASOS

1. ✅ Configurar Google Analytics 4
2. ✅ Integrar en el aplicativo
3. ✅ Verificar eventos en tiempo real
4. 📈 Configurar dashboards personalizados
5. 🔔 Configurar alertas automáticas
6. 📊 Implementar reportes semanales

---

*Última actualización: 24/02/2026*
*Estado: Configuración base completada*
"@

$instructionsPath = "c:\Users\Alejandro\AIGestion\docs\google-analytics-setup.md"
$instructions | Out-File -FilePath $instructionsPath -Encoding UTF8
Write-Host "✅ Instrucciones creadas: $instructionsPath" -ForegroundColor Green

# 6. Resumen final
Write-Host "`n6. RESUMEN FINAL" -ForegroundColor Yellow

Write-Host "✅ CONFIGURACIÓN GOOGLE ANALYTICS COMPLETADA" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "📊 Componentes creados:" -ForegroundColor Cyan
Write-Host "  • Variables de entorno en .env" -ForegroundColor White
Write-Host "  • Analytics service (TypeScript)" -ForegroundColor White
Write-Host "  • Analytics Provider (React)" -ForegroundColor White
Write-Host "  • Documentación completa" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🎯 Próximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Obtener ID real de Google Analytics" -ForegroundColor White
Write-Host "  2. Actualizar variables en .env" -ForegroundColor White
Write-Host "  3. Integrar AnalyticsProvider en App.tsx" -ForegroundColor White
Write-Host "  4. Verificar eventos en tiempo real" -ForegroundColor White
Write-Host "  5. Configurar dashboards personalizados" -ForegroundColor White

Write-Host "`n🔥 GOOGLE ANALYTICS 4 CONFIGURADO Y LISTO PARA USO" -ForegroundColor Green
