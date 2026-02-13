import { supabase } from './supabase';

type EventType = 'SYSTEM_HEALTH' | 'USER_INTERACTION' | 'ERROR' | 'PERFORMANCE';

interface AnalyticsEvent {
  type: EventType;
  name: string;
  data?: any;
  timestamp: string;
  url: string;
}

class AnalyticsService {
  private queue: AnalyticsEvent[] = [];
  private processing = false;
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 5000;

  constructor() {
    this.startFlushInterval();
    // Capture initial load performance
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        this.track('PERFORMANCE', 'page_load', {
          timing: window.performance?.timing?.toJSON?.() || {},
          navigator: navigator.userAgent,
        });
      });
    }
  }

  public track(type: EventType, name: string, data: any = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 [Analytics] ${type}:${name}`, data);
    }

    const event: AnalyticsEvent = {
      type,
      name,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    this.queue.push(event);

    if (this.queue.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  private async flush() {
    if (this.queue.length === 0 || this.processing) return;

    this.processing = true;
    const batch = [...this.queue];
    this.queue = [];

    try {
      if (supabase) {
        // Send to Supabase 'analytics_events' table if it exists
        // For now, we'll just log to console in production if table is missing
        // const { error } = await supabase.from('analytics_events').insert(batch);
        // if (error) throw error;
      }

      if (process.env.NODE_ENV === 'production') {
        // In "God Mode", we might want to send this to a dedicated endpoint
        // For now, we keep it client-side relative/debug
      }
    } catch (error) {
      console.warn('Failed to flush analytics queue', error);
      // Re-queue failed events (limit retries in real implementation)
      this.queue = [...batch, ...this.queue];
    } finally {
      this.processing = false;
    }
  }

  private startFlushInterval() {
    setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL);
  }
}

export const analytics = new AnalyticsService();
