import { useEffect, useState } from 'react';

interface WebVitalsMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
}

interface WebVitalsHookReturn {
  metrics: WebVitalsMetrics;
  isSupported: boolean;
}

export const useWebVitals = (): WebVitalsHookReturn => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Web Vitals are supported
    const supported =
      'PerformanceObserver' in window &&
      'PerformanceNavigationTiming' in window;

    setIsSupported(supported);

    if (!supported) return;

    // Largest Contentful Paint (LCP)
    const observeLCP = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });
    observeLCP.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const observeFID = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstEntry = entries[0] as any;
      if (firstEntry) {
        setMetrics(prev => ({ ...prev, fid: firstEntry.processingStart - firstEntry.startTime }));
      }
    });
    observeFID.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const observeCLS = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      }
    });
    observeCLS.observe({ entryTypes: ['layout-shift'] });

    // First Contentful Paint (FCP)
    const observeFCP = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });
    observeFCP.observe({ entryTypes: ['paint'] });

    // Time to First Byte (TTFB)
    const observeNavigation = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const navEntry = entries[0] as PerformanceNavigationTiming;
      if (navEntry) {
        setMetrics(prev => ({ ...prev, ttfb: navEntry.responseStart - navEntry.requestStart }));
      }
    });
    observeNavigation.observe({ entryTypes: ['navigation'] });

    return () => {
      observeLCP.disconnect();
      observeFID.disconnect();
      observeCLS.disconnect();
      observeFCP.disconnect();
      observeNavigation.disconnect();
    };
  }, []);

  return { metrics, isSupported };
};

export default useWebVitals;
