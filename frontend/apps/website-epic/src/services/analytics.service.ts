import { mixpanelService } from './mixpanel.service';
import { amplitudeService } from './amplitude.service';

export interface AnalyticsUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  subscription?: string;
}

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
      // Initialize GA4
      await this.loadGtag();
      gtag('js', new Date());
      gtag('config', this.measurementId, {
        debug_mode: import.meta.env.VITE_GOOGLE_ANALYTICS_DEBUG === 'true',
        send_page_view: false
      });

      // Initialize Mixpanel
      mixpanelService.initialize();

      // Initialize Amplitude
      amplitudeService.initialize();

      this.initialized = true;
      console.log('📊 Analytics System initialized (GA4 + Mixpanel + Amplitude)');
      
      this.trackPageView();
      
    } catch (error) {
      console.error('❌ Failed to initialize Analytics:', error);
    }
  }

  setUser(user: AnalyticsUser): void {
    if (!this.initialized) return;

    // Identify in Mixpanel
    mixpanelService.identify(user.id, {
      $email: user.email,
      $name: user.name,
      role: user.role,
      subscription: user.subscription,
    });

    // Identify in Amplitude
    amplitudeService.setUserId(user.id);
    amplitudeService.setUserProperties({
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription,
    });

    // Set user properties in GA4
    gtag('set', 'user_properties', {
      user_id: user.id,
      user_role: user.role,
      subscription_plan: user.subscription
    });
  }

  private async loadGtag(): Promise<void> {
    if (typeof window === 'undefined') return;
    return new Promise((resolve, reject) => {
      if (document.getElementById('gtag-js')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = 'gtag-js';
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
    const pageTitle = document.title;

    // GA4
    gtag('event', 'page_view', {
      page_location: pagePath,
      page_title: pageTitle
    });

    // Mixpanel
    mixpanelService.track('Page View', {
      path: pagePath,
      title: pageTitle
    });

    // Amplitude
    amplitudeService.track('Page View', {
      path: pagePath,
      title: pageTitle
    });
  }

  trackEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.initialized) return;
    
    // GA4
    gtag('event', eventName, parameters);

    // Mixpanel
    mixpanelService.track(eventName, parameters);

    // Amplitude
    amplitudeService.track(eventName, parameters);
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

  reset(): void {
    mixpanelService.reset();
    amplitudeService.reset();
  }
}

export const analytics = AnalyticsService.getInstance();

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void;
    dataLayer: any[];
  }
}
