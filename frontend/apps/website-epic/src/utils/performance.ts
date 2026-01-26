// Performance monitoring utilities
export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof globalThis !== 'undefined' && 'performance' in globalThis) {
      this.initObservers();
    }
  }

  private initObservers() {
    // First Contentful Paint
    this.observeEntry('paint', (entries) => {
      const fcp = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcp) {
        this.metrics.fcp = fcp.startTime;
      }
    });

    // Largest Contentful Paint
    this.observeEntry('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    });

    // First Input Delay
    this.observeEntry('first-input', (entries) => {
      const firstEntry = entries[0];
      this.metrics.fid = firstEntry.processingStart - firstEntry.startTime;
    });

    // Cumulative Layout Shift
    let clsValue = 0;
    this.observeEntry('layout-shift', (entries) => {
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.metrics.cls = clsValue;
    });

    // Time to First Byte
    this.observeNavigation();
  }

  private observeEntry(type: string, callback: (entries: any[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported:`, error);
    }
  }

  private observeNavigation() {
    if ('navigation' in performance) {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public logMetrics() {
    console.table(this.metrics);

    // Send to analytics service (optional)
    if (typeof gtag !== 'undefined') {
      Object.entries(this.metrics).forEach(([metric, value]) => {
        gtag('event', metric, {
          event_category: 'Web Vitals',
          value: Math.round(metric === 'cls' ? value * 1000 : value),
          non_interaction: true,
        });
      });
    }
  }

  public disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Initialize performance monitoring
export const performanceMonitor = new PerformanceMonitor();

// Log metrics when page loads
if (typeof globalThis !== 'undefined') {
  globalThis.addEventListener?.('load', () => {
    setTimeout(() => {
      performanceMonitor.logMetrics();
    }, 0);
  });
}

// Export hook for React components
export const usePerformanceMonitoring = () => {
  const getMetrics = () => performanceMonitor.getMetrics();
  const logMetrics = () => performanceMonitor.logMetrics();

  return { getMetrics, logMetrics };
};
