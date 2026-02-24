// Google Analytics 4 Service - AIGestion
export class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized = false;
  private measurementId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX';

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load gtag script
      await this.loadGtag();
      
      // Initialize GA4
      gtag('js', new Date());
      gtag('config', this.measurementId, {
        debug_mode: import.meta.env.VITE_GOOGLE_ANALYTICS_DEBUG === 'true',
        send_page_view: false
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
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  trackPageView(path?: string): void {
    if (!this.initialized) return;
    
    const pagePath = path || window.location.pathname;
    gtag('event', 'page_view', {
      page_location: pagePath,
      page_title: document.title
    });
  }

  trackEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.initialized) return;
    
    gtag('event', eventName, parameters);
  }

  trackFeatureUsed(featureName: string, category: string): void {
    this.trackEvent('feature_used', {
      feature_name: featureName,
      feature_category: category
    });
  }

  trackAIChatStart(model: string, sessionId: string): void {
    this.trackEvent('ai_chat_start', {
      ai_model: model,
      session_id: sessionId
    });
  }

  trackAIChatEnd(model: string, sessionId: string, messageCount: number): void {
    this.trackEvent('ai_chat_end', {
      ai_model: model,
      session_id: sessionId,
      message_count: messageCount
    });
  }

  trackError(errorType: string, errorMessage: string, context?: string): void {
    this.trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      context
    });
  }

  trackPerformanceMetric(metricName: string, value: number, unit: string = 'ms'): void {
    this.trackEvent('performance_metric', {
      metric_name: metricName,
      value,
      unit
    });
  }
}

export const analytics = AnalyticsService.getInstance();

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void;
    dataLayer: any[];
  }
}
