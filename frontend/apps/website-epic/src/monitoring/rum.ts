import { useCallback, useEffect, useState } from 'react';

export interface RUMMetric {
  readonly name: string;
  readonly value: number;
  readonly rating: 'good' | 'needs-improvement' | 'poor';
  readonly timestamp: number;
  readonly url: string;
  readonly userAgent: string;
  readonly connectionType: string;
  readonly deviceType: string;
}

export interface RUMConfig {
  readonly sampleRate?: number;
  readonly beaconEndpoint?: string;
  readonly apiKey?: string;
  readonly trackResources?: boolean;
  readonly trackLongTasks?: boolean;
  readonly trackUserTiming?: boolean;
  readonly trackPaintTiming?: boolean;
  readonly trackLayoutShift?: boolean;
  readonly trackCLS?: boolean;
  readonly trackFID?: boolean;
  readonly trackINP?: boolean;
  readonly trackTTFB?: number;
}

export interface RUMReport {
  readonly metrics: RUMMetric[];
  vitals: {
    readonly fcp: number;
    readonly lcp: number;
    cls: number;
    fid: number;
    inp: number;
    ttfb: number;
  };
  readonly performance: {
    readonly navigationStart: number;
    readonly loadEventEnd: number;
    readonly domContentLoaded: number;
    readonly firstPaint: number;
    readonly firstContentfulPaint: number;
  };
  readonly user: {
    id?: string;
    agent: string;
    device: string;
    connection: string;
  };
  readonly timestamp: number;
}

export interface WebVitals {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  inp: number; // Interaction to Next Paint
  ttfb: number; // Time to First Byte
}

export function useRUM(config: RUMConfig = {}) {
  const [metrics, setMetrics] = useState<RUMMetric[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  const {
    sampleRate = 0.1,
    trackResources = true,
    trackLongTasks = true,
    trackUserTiming = true,
    trackPaintTiming = true,
    trackLayoutShift = true,
    trackCLS = true,
    trackFID = true,
    trackINP = true,
    trackTTFB = 100,
    ...restConfig
  } = config;

  // Check if Performance Observer API is supported
  useEffect(() => {
    const supported =
      'PerformanceObserver' in globalThis &&
      'PerformanceNavigationTiming' in globalThis &&
      'PerformancePaintTiming' in globalThis &&
      'PerformanceObserver' in globalThis;

    setIsSupported(supported);
  }, []);

  // Collect Core Web Vitals
  const collectWebVitals = useCallback(async (): Promise<WebVitals> => {
    if (!isSupported) {
      throw new Error('Performance Observer API not supported');
    }

    return new Promise((resolve, reject) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        const vitals: WebVitals = {
          fcp: 0,
          lcp: 0,
          cls: 0,
          fid: 0,
          inp: 0,
          ttfb: 0,
        };

        entries.forEach((entry: any) => {
          switch (entry.name) {
            case 'first-contentful-paint':
              vitals.fcp = entry.startTime;
              break;
            case 'largest-contentful-paint':
              vitals.lcp = entry.startTime;
              break;
            case 'cumulative-layout-shift':
              vitals.cls = entry.value;
              break;
            case 'first-input':
              vitals.fid = entry.processingStart - entry.startTime;
              vitals.inp = entry.startTime + entry.duration;
              break;
            case 'time-to-first-byte':
              vitals.ttfb = entry.responseStart - (entry.requestStart || 0);
              break;
          }
        });

        resolve(vitals);
      });

      observer.observe({
        entryTypes: [
          'paint',
          'largest-contentful-paint',
          'layout-shift',
          'first-input',
          'navigation',
        ],
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        observer.disconnect();
        reject(new Error('Web Vitals collection timeout'));
      }, 10000);
    });
  }, [isSupported]);

  // Collect Resource Timing
  const collectResourceTiming = useCallback(async (): Promise<PerformanceResourceTiming[]> => {
    if (!isSupported) {
      return [];
    }

    const resources = performance.getEntriesByType('resource');
    return resources as PerformanceResourceTiming[];
  }, [isSupported]);

  // Collect User Timing
  const collectUserTiming = useCallback(async (): Promise<PerformanceEntry[]> => {
    if (!isSupported) {
      return [];
    }

    const userTimings = performance.getEntriesByType('measure');
    return userTimings;
  }, [isSupported]);

  // Collect Long Tasks
  const collectLongTasks = useCallback(async (): Promise<PerformanceEntry[]> => {
    if (!isSupported) {
      return [];
    }

    const longTasks = performance.getEntriesByType('longtask');
    return longTasks;
  }, [isSupported]);

  // Collect Navigation Timing
  const collectNavigationTiming = useCallback(async (): Promise<PerformanceNavigationTiming> => {
    if (!isSupported) {
      throw new Error('Navigation Timing API not supported');
    }

    const navigationEntries = performance.getEntriesByType('navigation');
    return navigationEntries[0] as PerformanceNavigationTiming;
  }, [isSupported]);

  // Collect Performance Metrics
  const collectPerformanceMetrics = useCallback(async (): Promise<{
    navigation: PerformanceNavigationTiming;
    resources: PerformanceResourceTiming[];
    userTimings: PerformanceEntry[];
    longTasks: PerformanceEntry[];
    vitals: WebVitals;
    performance: {
      navigationStart: number;
      loadEventEnd: number;
      domContentLoaded: number;
      firstPaint: number;
      firstContentfulPaint: number;
    };
  }> => {
    const [navigation, resources, userTimings, longTasks, vitals] = await Promise.all([
      collectNavigationTiming(),
      collectResourceTiming(),
      collectUserTiming(),
      collectLongTasks(),
      collectWebVitals(),
    ]);

    return {
      navigation,
      resources,
      userTimings,
      longTasks,
      vitals,
      // Combine with performance timing
      performance: {
        navigationStart: navigation.fetchStart,
        loadEventEnd: navigation.loadEventEnd,
        domContentLoaded: navigation.domContentLoadedEventEnd,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
      },
    };
  }, [isSupported]);

  // Calculate performance scores
  const calculateScores = useCallback((
    metrics: RUMMetric[]
  ): {
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
    inp: number;
    ttfb: number;
  } => {
    const scores = {
      fcp: 0,
      lcp: 0,
      cls: 0,
      fid: 0,
      inp: 0,
      ttfb: 0,
    };

    metrics.forEach(metric => {
      switch (metric.name) {
        case 'fcp':
          scores.fcp = calculateFCPScore(metric.value);
          break;
        case 'lcp':
          scores.lcp = calculateLCPScore(metric.value);
          break;
        case 'cls':
          scores.cls = calculateCLSScore(metric.value);
          break;
        case 'fid':
          scores.fid = calculateFIDScore(metric.value);
          break;
        case 'inp':
          scores.inp = calculateINPScore(metric.value);
          break;
        case 'ttfb':
          scores.ttfb = calculateTTFBScore(metric.value);
          break;
      }
    });

    return scores;
  }, []);

  // Core Web Vitals scoring functions
  const calculateFCPScore = (value: number): number => {
    if (value >= 1800) return 0;
    if (value >= 1000) return 0.5;
    if (value >= 600) return 0.75;
    if (value >= 400) return 0.85;
    if (value >= 200) return 0.95;
    return 1;
  };

  const calculateLCPScore = (value: number): number => {
    if (value >= 4000) return 0;
    if (value >= 2500) return 0.5;
    if (value >= 1800) return 0.75;
    if (value <= 1000) return 1;
    return 0.9;
  };

  const calculateCLSScore = (value: number): number => {
    if (value >= 0.25) return 0;
    if (value >= 0.1) return 0.5;
    if (value >= 0.05) return 0.75;
    return 1;
  };

  const calculateFIDScore = (value: number): number => {
    if (value >= 300) return 0;
    if (value >= 100) return 0.5;
    if (value >= 50) return 0.75;
    return 1;
  };

  const calculateINPScore = (value: number): number => {
    if (value >= 100) return 0;
    if (value >= 50) return 0.5;
    if (value >= 20) return 0.75;
    return 1;
  };

  const calculateTTFBScore = (value: number): number => {
    if (value >= 800) return 0;
    if (value >= 600) return 0.5;
    if (value >= 400) return 0.75;
    if (value >= 200) return 0.9;
    return 1;
  };

  // Get rating from score
  const getRating = (score: number): 'good' | 'needs-improvement' | 'poor' => {
    if (score >= 0.9) return 'good';
    if (score >= 0.5) return 'needs-improvement';
    return 'poor';
  };

  // Send metrics to beacon endpoint
  const sendToBeacon = useCallback((metrics: RUMMetric[]) => {
    if (!config.beaconEndpoint || !metrics.length) return;

    const payload = {
      metrics,
      user: {
        agent: navigator.userAgent,
        device: getDeviceType(),
        connection: getConnectionType(),
      },
      timestamp: Date.now(),
      url: globalThis.location.href,
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      });

      navigator.sendBeacon(config.beaconEndpoint, blob);
    } else {
      // Fallback to fetch
      fetch(config.beaconEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  }, [config.beaconEndpoint]);

  // Main RUM collection function
  const collectMetrics = useCallback(async (): Promise<RUMReport> => {
    if (!isSupported) {
      throw new Error('RUM not supported');
    }

    setIsCollecting(true);

    try {
      const { navigation, resources, userTimings, longTasks, vitals } = await collectPerformanceMetrics();

      // Process and categorize metrics
      const processedMetrics: RUMMetric[] = [];

      // Add Core Web Vitals
      Object.entries(vitals).forEach(([name, value]) => {
        processedMetrics.push({
          name,
          value,
          rating: getRating((calculateScores({ [name]: value } as any) as any)[`${name}`]),
          timestamp: Date.now(),
          url: globalThis.location.href,
          userAgent: navigator.userAgent,
          connectionType: getConnectionType(),
          deviceType: getDeviceType(),
        });
      });

      // Add Resource Timing metrics
      if (trackResources) {
        resources.forEach((resource) => {
          processedMetrics.push({
            name: 'resource-timing',
            value: resource.responseEnd - resource.requestStart,
            rating: 'good',
            timestamp: Date.now(),
            url: resource.name,
            userAgent: navigator.userAgent,
            connectionType: getConnectionType(),
            deviceType: getDeviceType(),
          });
        });
      }

      // Add User Timing metrics
      if (trackUserTiming) {
        userTimings.forEach((timing) => {
          processedMetrics.push({
            name: 'user-timing',
            value: timing.duration || 0,
            rating: 'good',
            timestamp: timing.startTime || Date.now(),
            url: timing.name || globalThis.location.href,
            userAgent: navigator.userAgent,
            connectionType: getConnectionType(),
            deviceType: getDeviceType(),
          });
        });
      }

      // Add Long Task metrics
      if (trackLongTasks) {
        longTasks.forEach((task) => {
          processedMetrics.push({
            name: 'long-task',
            value: task.duration || 0,
            rating: task.duration > 50 ? 'poor' : 'good',
            timestamp: task.startTime || Date.now(),
            url: task.name || globalThis.length > 0 ? globalThis.location.href : 'unknown',
            userAgent: navigator.userAgent,
            connectionType: getConnectionType(),
            deviceType: getDeviceType(),
          });
        });
      }

      // Apply sampling
      const sampledMetrics = sampleRate >= 1
        ? processedMetrics
        : processedMetrics.filter(() => Math.random() < sampleRate);

      setMetrics(sampledMetrics);

      // Send to beacon endpoint
      if (sampledMetrics.length > 0) {
        await sendToBeacon(sampledMetrics);
      }

      const report: RUMReport = {
        metrics: sampledMetrics,
        vitals,
        performance: {
          navigationStart: navigation.fetchStart,
          loadEventEnd: navigation.loadEventEnd,
          domContentLoaded: navigation.domContentLoadedEventEnd,
          firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
        },
        user: {
          agent: navigator.userAgent,
          device: getDeviceType(),
          connection: getConnectionType(),
        },
        timestamp: Date.now(),
      };

      setIsCollecting(false);
      return report;
    } catch (error) {
      console.error('RUM collection failed:', error);
      setIsCollecting(false);
      throw error;
    }
  }, [isSupported, config, sampleRate, trackResources, trackUserTiming, trackLongTasks]);

  // Auto-collect metrics on page load
  useEffect(() => {
    if (isSupported && !isCollecting) {
      // Wait for page to fully load
      globalThis.addEventListener('load', () => {
        setTimeout(() => {
          collectMetrics().catch(console.error);
        }, 1000);
      });
    }
  }, [isSupported, isCollecting, collectMetrics]);

  return {
    metrics,
    isSupported,
    isCollecting,
    collectMetrics,
    collectWebVitals,
    collectResourceTiming,
    collectUserTiming,
    collectLongTasks,
    collectNavigationTiming,
    calculateScores,
    getRating,
    sendToBeacon,
  };
}

// Utility functions
function getDeviceType(): string {
  const ua = navigator.userAgent;

  if (/tablet|iPad|Android(?!.*Mobile)|Safari/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return 'mobile';
  }
  if (/Windows|Mac|Linux|X11/i.test(ua)) {
    return 'desktop';
  }
  return 'unknown';
}

function getConnectionType(): string {
  const connection = (navigator as any).connection || {};
  return connection.effectiveType || connection.type || 'unknown';
}

// Custom RUM hook for specific metrics
export function useFCP() {
  const { collectWebVitals, isSupported } = useRUM();
  const [fcp, setFCP] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    const updateFCP = async () => {
      try {
        const vitals = await collectWebVitals();
        setFCP(vitals.fcp);
      } catch (error) {
        console.error('FCP collection failed:', error);
      }
    };

    // Collect FCP on page load
    globalThis.addEventListener('load', () => {
      setTimeout(updateFCP, 1000);
    });
  }, [isSupported, collectWebVitals]);

  return { fcp, isSupported };
}

export function useLCP() {
  const { collectWebVitals, isSupported } = useRUM();
  const [lcp, setLCP] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    const updateLCP = async () => {
      try {
        const vitals = await collectWebVitals();
        setLCP(vitals.lcp);
      } catch (error) {
        console.error('LCP collection failed:', error);
      }
    };

    // Collect LCP on page load
    globalThis.addEventListener('load', () => {
      setTimeout(updateLCP, 1000);
    });
  }, [isSupported, collectWebVitals]);

  return { lcp, isSupported };
}

export function useCLS() {
  const { isSupported } = useRUM();
  const [cls, setCLS] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    // Removed unused updateCLS function

    // Monitor CLS continuously
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const clsValue = entries.reduce((sum, entry: any) => sum + (entry.value || 0), 0);
      setCLS(clsValue);
    });

    observer.observe({ type: 'layout-shift', buffered: true });

    return () => observer.disconnect();
  }, [isSupported]);

  return { cls: cls || 0, isSupported };
}

export function useFID() {
  const { collectWebVitals, isSupported } = useRUM();
  const [fid, setFID] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    const updateFID = async () => {
      try {
        const vitals = await collectWebVitals();
        setFID(vitals.fid);
      } catch (error) {
        console.error('FID collection failed:', error);
      }
    };

    // Collect FID on first interaction
    globalThis.addEventListener('pointerdown', () => { updateFID(); }, { once: true });
  }, [isSupported, collectWebVitals]);

  return { fid, isSupported };
}

export function useINP() {
  const { collectWebVitals, isSupported } = useRUM();
  const [inp, setINP] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    const updateINP = async () => {
      try {
        const vitals = await collectWebVitals();
        setINP(vitals.inp);
      } catch (error) {
        console.error('INP collection failed:', error);
      }
    };

    // Collect INP on interaction
    globalThis.addEventListener('pointerdown', () => { updateINP(); }, { once: true });
  }, [isSupported, collectWebVitals]);

  return { inp, isSupported };
}

export function useTTFB() {
  const { collectWebVitals, isSupported } = useRUM();
  const [ttfb, setTTFB] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    const updateTTFB = async () => {
      try {
        const vitals = await collectWebVitals();
        setTTFB(vitals.ttfb);
      } catch (error) {
        console.error('TTFB collection failed:', error);
      }
    };

    // Collect TTFB on page load
    globalThis.addEventListener('load', () => {
      setTimeout(updateTTFB, 1000);
    });
  }, [isSupported, collectWebVitals]);

  return { ttfb, isSupported };
}
