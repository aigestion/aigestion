/**
 * Analytics Manager - Business Intelligence
 * Sistema completo de analytics y business intelligence para AIGestion
 */

// Tipos de eventos de analytics
export interface AnalyticsEvent {
  event: string
  category: 'navigation' | 'engagement' | 'conversion' | 'performance' | 'error' | 'user' | 'business'
  action: string
  label?: string
  value?: number
  userId?: string
  sessionId?: string
  timestamp: number
  properties?: Record<string, any>
  metadata?: {
    userAgent: string
    url: string
    referrer?: string
    screenResolution: string
    viewportSize: string
    language: string
    timezone: string
  }
}

// Métricas de negocio
export interface BusinessMetrics {
  users: {
    total: number
    active: number
    new: number
    returning: number
    churned: number
  }
  engagement: {
    pageViews: number
    sessions: number
    bounceRate: number
    avgSessionDuration: number
    pagesPerSession: number
  }
  conversions: {
    total: number
    rate: number
    value: number
    bySource: Record<string, number>
    byCampaign: Record<string, number>
  }
  performance: {
    avgLoadTime: number
    coreWebVitals: {
      lcp: number
      fid: number
      cls: number
      fcp: number
      ttfb: number
    }
    errorRate: number
    uptime: number
  }
  content: {
    mostViewedPages: Array<{
      path: string
      views: number
      avgTimeOnPage: number
      exitRate: number
    }>
    popularFeatures: Array<{
      feature: string
      usage: number
      conversionRate: number
    }>
    searchQueries: Array<{
      query: string
      count: number
      results: number
    }>
  }
}

// Configuración de analytics
interface AnalyticsConfig {
  trackingId: string
  sampleRate: number
  debugMode: boolean
  customDimensions: Record<string, string>
  enableEcommerce: boolean
  enableEnhancedEcommerce: boolean
  enableLinker: boolean
  enableDisplayFeatures: boolean
  enableAdFeatures: boolean
}

class AnalyticsManager {
  private config: AnalyticsConfig
  private isInitialized = false
  private eventQueue: AnalyticsEvent[] = []
  private sessionStartTime: number
  private userId: string | null = null
  private sessionId: string
  private pageViewCount = 0
  private conversionEvents: string[] = [
    'sign_up',
    'purchase',
    'subscription',
    'contact_form',
    'demo_request',
    'quote_request'
  ]

  constructor(config: AnalyticsConfig) {
    this.config = config
    this.sessionId = this.generateSessionId()
    this.sessionStartTime = Date.now()
  }

  /**
   * Inicializar analytics
   */
  initialize(): void {
    if (this.isInitialized) return

    try {
      // Inicializar Google Analytics 4
      this.initializeGA4()
      
      // Inicializar eventos personalizados
      this.setupCustomEvents()
      
      // Configurar tracking automático
      this.setupAutomaticTracking()
      
      this.isInitialized = true
      console.log('📊 Analytics initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize analytics:', error)
    }
  }

  /**
   * Inicializar Google Analytics 4
   */
  private initializeGA4(): void {
    // gtag script initialization
    if (typeof window !== 'undefined' && !window.gtag) {
      window.dataLayer = window.dataLayer || []
      window.gtag = function(...args: any[]) {
        window.dataLayer.push(arguments)
      }
      
      // Load gtag script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.trackingId}`
      document.head.appendChild(script)
      
      // Configure gtag
      window.gtag('js', new Date())
      window.gtag('config', this.config.trackingId, {
        sample_rate: this.config.sampleRate,
        debug_mode: this.config.debugMode,
        custom_map: this.config.customDimensions,
        ecommerce: this.config.enableEcommerce,
        enhanced_ecommerce: this.config.enableEnhancedEcommerce,
        linker: this.config.enableLinker,
        display_features: this.config.enableDisplayFeatures,
        ad_features: this.config.enableAdFeatures,
      })
    }
  }

  /**
   * Configurar eventos personalizados
   */
  private setupCustomEvents(): void {
    // Eventos de usuario
    this.trackEvent('user', 'session_start', {
      session_id: this.sessionId,
      timestamp: Date.now()
    })

    // Eventos de página
    this.trackPageView()
  }

  /**
   * Configurar tracking automático
   */
  private setupAutomaticTracking(): void {
    // Tracking de salida de página
    window.addEventListener('beforeunload', () => {
      this.trackEvent('user', 'session_end', {
        session_id: this.sessionId,
        duration: Date.now() - this.sessionStartTime,
        page_views: this.pageViewCount
      })
    })

    // Tracking de errores
    window.addEventListener('error', (event) => {
      this.trackEvent('error', 'javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    // Tracking de promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('error', 'promise_rejection', {
        reason: event.reason
      })
    })
  }

  /**
   * Trackear evento genérico
   */
  trackEvent(
    category: AnalyticsEvent['category'],
    action: string,
    options?: {
      label?: string
      value?: number
      properties?: Record<string, any>
    }
  ): void {
    const event: AnalyticsEvent = {
      event: `${category}_${action}`,
      category,
      action,
      label: options?.label,
      value: options?.value,
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      properties: options?.properties,
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }

    if (this.isInitialized) {
      this.sendEvent(event)
    } else {
      this.eventQueue.push(event)
    }
  }

  /**
   * Trackear page view
   */
  trackPageView(page?: string): void {
    const pagePath = page || window.location.pathname
    
    if (this.isInitialized && window.gtag) {
      window.gtag('config', this.config.trackingId, {
        page_path: pagePath
      })
    }

    this.pageViewCount++
    this.trackEvent('navigation', 'page_view', {
      label: pagePath,
      properties: {
        page_title: document.title,
        page_path: pagePath
      }
    })
  }

  /**
   * Trackear evento de conversión
   */
  trackConversion(
    conversionType: string,
    value?: number,
    currency?: string,
    options?: {
      label?: string
      properties?: Record<string, any>
    }
  ): void {
    this.trackEvent('conversion', conversionType, {
      label: options?.label || conversionType,
      value,
      properties: {
        currency,
        ...options?.properties
      }
    })

    // Ecommerce tracking si está habilitado
    if (this.config.enableEcommerce && value) {
      this.trackEcommerce('purchase', {
        transaction_id: this.generateTransactionId(),
        value,
        currency: currency || 'USD',
        items: [{
          item_name: conversionType,
          item_category: 'conversion',
          price: value,
          quantity: 1
        }]
      })
    }
  }

  /**
   * Trackear evento de engagement
   */
  trackEngagement(
    action: string,
    options?: {
      label?: string
      value?: number
      properties?: Record<string, any>
    }
  ): void {
    this.trackEvent('engagement', action, options)
  }

  /**
   * Trackear evento de performance
   */
  trackPerformance(
    metric: string,
    value: number,
    options?: {
      label?: string
      properties?: Record<string, any>
    }
  ): void {
    this.trackEvent('performance', metric, {
      label: options?.label || metric,
      value,
      properties: options?.properties
    })
  }

  /**
   * Trackear evento de usuario
   */
  trackUser(
    action: string,
    options?: {
      label?: string
      value?: number
      properties?: Record<string, any>
    }
  ): void {
    this.trackEvent('user', action, options)
  }

  /**
   * Trackear evento de negocio
   */
  trackBusiness(
    action: string,
    options?: {
      label?: string
      value?: number
      properties?: Record<string, any>
    }
  ): void {
    this.trackEvent('business', action, options)
  }

  /**
   * Trackear ecommerce
   */
  private trackEcommerce(
    action: string,
    data: any
  ): void {
    if (this.isInitialized && window.gtag) {
      window.gtag('event', action, data)
    }
  }

  /**
   * Enviar evento a analytics
   */
  private sendEvent(event: AnalyticsEvent): void {
    if (this.isInitialized && window.gtag) {
      window.gtag('event', event.event, {
        event_category: event.category,
        event_action: event.action,
        event_label: event.label,
        value: event.value,
        custom_map: {
          user_id: event.userId,
          session_id: event.sessionId,
          ...event.properties
        }
      })
    }
  }

  /**
   * Procesar cola de eventos pendientes
   */
  processEventQueue(): void {
    while (this.eventQueue.length > 0 && this.isInitialized) {
      const event = this.eventQueue.shift()
      this.sendEvent(event)
    }
  }

  /**
   * Establecer ID de usuario
   */
  setUserId(userId: string): void {
    this.userId = userId
    
    if (this.isInitialized && window.gtag) {
      window.gtag('config', this.config.trackingId, {
        user_id: userId
      })
    }
  }

  /**
   * Obtener métricas de negocio
   */
  async getBusinessMetrics(): Promise<BusinessMetrics> {
    // Aquí se implementaría la lógica para obtener métricas de Google Analytics 4 API
    // Por ahora, retornamos métricas simuladas
    
    return {
      users: {
        total: 1000,
        active: 250,
        new: 50,
        returning: 200,
        churned: 25
      },
      engagement: {
        pageViews: 5000,
        sessions: 1200,
        bounceRate: 0.35,
        avgSessionDuration: 180,
        pagesPerSession: 4.2
      },
      conversions: {
        total: 45,
        rate: 0.0375,
        value: 15000,
        bySource: {
          organic: 20,
          direct: 15,
          social: 8,
          email: 2
        },
        byCampaign: {
          'summer_sale': 12,
          'newsletter': 8,
          'webinar': 6
        }
      },
      performance: {
        avgLoadTime: 2.1,
        coreWebVitals: {
          lcp: 1.8,
          fid: 45,
          cls: 0.1,
          fcp: 1.2,
          ttfb: 0.8
        },
        errorRate: 0.02,
        uptime: 0.998
      },
      content: {
        mostViewedPages: [
          { path: '/', views: 2000, avgTimeOnPage: 120, exitRate: 0.25 },
          { path: '/dashboard', views: 800, avgTimeOnPage: 300, exitRate: 0.15 },
          { path: '/features', views: 600, avgTimeOnPage: 180, exitRate: 0.30 }
        ],
        popularFeatures: [
          { feature: 'cinematic_presentation', usage: 450, conversionRate: 0.05 },
          { feature: 'daniela_ai', usage: 380, conversionRate: 0.08 },
          { feature: 'dashboard', usage: 320, conversionRate: 0.12 }
        ],
        searchQueries: [
          { query: 'ai features', count: 45, results: 12 },
          { query: 'pricing', count: 32, results: 8 },
          { query: 'demo', count: 28, results: 6 }
        ]
      }
    }
  }

  /**
   * Generar ID de sesión
   */
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Generar ID de transacción
   */
  private generateTransactionId(): string {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Generar reporte de analytics
   */
  async generateReport(dateRange: { start: Date; end: Date }): Promise<{
    summary: any
    metrics: BusinessMetrics
    insights: string[]
    recommendations: string[]
  }> {
    const metrics = await this.getBusinessMetrics()
    
    const insights = [
      `Tasa de conversión del ${(metrics.conversions.rate * 100).toFixed(2)}%`,
      `Tiempo promedio de carga: ${metrics.performance.avgLoadTime}s`,
      `Tasa de rebote: ${(metrics.engagement.bounceRate * 100).toFixed(1)}%`,
      `Usuarios activos: ${metrics.users.active} de ${metrics.users.total}`
    ]

    const recommendations = [
      'Optimizar landing pages para reducir tasa de rebote',
      'Implementar A/B testing en llamadas a la acción',
      'Mejorar tiempo de carga para mejor experiencia de usuario',
      'Personalizar contenido basado en comportamiento del usuario'
    ]

    return {
      summary: {
        totalUsers: metrics.users.total,
        totalConversions: metrics.conversions.total,
        totalRevenue: metrics.conversions.value,
        avgSessionDuration: metrics.engagement.avgSessionDuration,
        dateRange
      },
      metrics,
      insights,
      recommendations
    }
  }
}

// Instancia global del analytics manager
export const analyticsManager = new AnalyticsManager({
  trackingId: 'G-XXXXXXXXXX', // Reemplazar con ID real
  sampleRate: 0.1, // 10% de los usuarios
  debugMode: process.env.NODE_ENV === 'development',
  customDimensions: {
    'custom_dimension_1': 'user_type',
    'custom_dimension_2': 'feature_usage'
  },
  enableEcommerce: true,
  enableEnhancedEcommerce: false,
  enableLinker: true,
  enableDisplayFeatures: true,
  enableAdFeatures: false
})

// Hook para usar analytics en React
export function useAnalytics() {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      analyticsManager.initialize()
      analyticsManager.processEventQueue()
      setIsInitialized(true)
    }
  }, [isInitialized])

  return {
    isInitialized,
    trackEvent: analyticsManager.trackEvent.bind(analyticsManager),
    trackPageView: analyticsManager.trackPageView.bind(analyticsManager),
    trackConversion: analyticsManager.trackConversion.bind(analyticsManager),
    trackEngagement: analyticsManager.trackEngagement.bind(analyticsManager),
    trackPerformance: analyticsManager.trackPerformance.bind(analyticsManager),
    trackUser: analyticsManager.trackUser.bind(analyticsManager),
    trackBusiness: analyticsManager.trackBusiness.bind(analyticsManager),
    setUserId: analyticsManager.setUserId.bind(analyticsManager),
    getMetrics: analyticsManager.getBusinessMetrics.bind(analyticsManager),
    generateReport: analyticsManager.generateReport.bind(analyticsManager)
  }
}

export default analyticsManager
