/**
 * Performance Monitor - Real-time Monitoring
 * Sistema de monitoreo de rendimiento para AIGestion
 */

import { useState, useEffect } from 'react';

// Web Vitals Monitoring
export interface WebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

// Performance Metrics
export interface PerformanceMetrics {
  timestamp: number;
  url: string;
  userAgent: string;
  vitals: WebVitals;
  memory?: PerformanceMemory;
  navigation?: PerformanceNavigationTiming;
  resources: PerformanceResourceTiming[];
}

// Error Tracking
export interface ErrorInfo {
  timestamp: number;
  message: string;
  stack?: string;
  source: string;
  line?: number;
  column?: number;
  userAgent: string;
  url: string;
  userId?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private errors: ErrorInfo[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;
  private config = {
    maxMetrics: 100,
    maxErrors: 50,
    sampleRate: 0.1, // 10% de los usuarios
    endpoint: '/api/analytics/performance',
  };

  constructor(config?: Partial<typeof this.config>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Iniciar monitoreo de rendimiento
   */
  start() {
    if (this.isMonitoring || Math.random() > this.config.sampleRate) {
      return;
    }

    this.isMonitoring = true;
    this.setupWebVitals();
    this.setupResourceTiming();
    this.setupErrorTracking();
    this.setupMemoryMonitoring();

    console.log('🔍 Performance monitoring started');
  }

  /**
   * Detener monitoreo
   */
  stop() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
    console.log('⏹️ Performance monitoring stopped');
  }

  /**
   * Configurar Web Vitals
   */
  private setupWebVitals() {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;
      this.recordMetric('lcp', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.recordMetric('fid', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.recordMetric('cls', clsValue);
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.recordMetric('fcp', fcpEntry.startTime);
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    this.observers.push(fcpObserver);
  }

  /**
   * Configurar Resource Timing
   */
  private setupResourceTiming() {
    const resourceObserver = new PerformanceObserver(list => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      entries.forEach(entry => {
        // Solo monitorear recursos propios
        if (entry.name.startsWith(window.location.origin)) {
          this.analyzeResourceTiming(entry);
        }
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);
  }

  /**
   * Configurar tracking de errores
   */
  private setupErrorTracking() {
    // Errores de JavaScript
    window.addEventListener('error', event => {
      this.recordError({
        timestamp: Date.now(),
        message: event.message,
        stack: event.error?.stack,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });

    // Promesas rechazadas no manejadas
    window.addEventListener('unhandledrejection', event => {
      this.recordError({
        timestamp: Date.now(),
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        source: 'Promise',
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });
  }

  /**
   * Configurar monitoreo de memoria
   */
  private setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory as PerformanceMemory;
        this.recordMemoryUsage(memory);
      }, 30000); // Cada 30 segundos
    }
  }

  /**
   * Registrar métrica
   */
  private recordMetric(type: keyof WebVitals, value: number) {
    if (!this.isMonitoring) return;

    const timestamp = Date.now();
    const existingMetric = this.metrics.find(m => Math.abs(m.timestamp - timestamp) < 1000);

    if (existingMetric) {
      existingMetric.vitals[type] = value;
    } else {
      const newMetric: PerformanceMetrics = {
        timestamp,
        url: window.location.href,
        userAgent: navigator.userAgent,
        vitals: { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0, [type]: value },
        resources: [],
      };
      this.metrics.push(newMetric);
    }

    this.cleanupMetrics();
  }

  /**
   * Analizar Resource Timing
   */
  private analyzeResourceTiming(entry: PerformanceResourceTiming) {
    const duration = entry.responseEnd - entry.requestStart;
    const size = entry.transferSize || 0;

    // Alertar si un recurso tarda más de 3 segundos
    if (duration > 3000) {
      console.warn(`🐌 Slow resource detected: ${entry.name} (${duration.toFixed(2)}ms)`);
    }

    // Alertar si un recurso es muy grande (>1MB)
    if (size > 1024 * 1024) {
      console.warn(
        `📦 Large resource detected: ${entry.name} (${(size / 1024 / 1024).toFixed(2)}MB)`
      );
    }
  }

  /**
   * Registrar uso de memoria
   */
  private recordMemoryUsage(memory: PerformanceMemory) {
    const usedMB = memory.usedJSHeapSize / 1024 / 1024;
    const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
    const usagePercent = (usedMB / limitMB) * 100;

    // Alertar si el uso de memoria es alto (>80%)
    if (usagePercent > 80) {
      console.warn(`🧠 High memory usage: ${usedMB.toFixed(2)}MB (${usagePercent.toFixed(1)}%)`);
    }
  }

  /**
   * Registrar error
   */
  private recordError(error: ErrorInfo) {
    this.errors.push(error);
    this.cleanupErrors();

    // Enviar error crítico inmediatamente
    if (this.isCriticalError(error)) {
      this.sendErrorAlert(error);
    }
  }

  /**
   * Determinar si un error es crítico
   */
  private isCriticalError(error: ErrorInfo): boolean {
    const criticalPatterns = [
      'chunkload',
      'loading chunk',
      'network error',
      'timeout',
      'quota exceeded',
    ];

    return criticalPatterns.some(pattern => error.message.toLowerCase().includes(pattern));
  }

  /**
   * Enviar alerta de error crítico
   */
  private async sendErrorAlert(error: ErrorInfo) {
    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'critical_error',
          error,
          timestamp: Date.now(),
        }),
      });
    } catch (err) {
      console.error('Failed to send error alert:', err);
    }
  }

  /**
   * Limpiar métricas antiguas
   */
  private cleanupMetrics() {
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }
  }

  /**
   * Limpiar errores antiguos
   */
  private cleanupErrors() {
    if (this.errors.length > this.config.maxErrors) {
      this.errors = this.errors.slice(-this.config.maxErrors);
    }
  }

  /**
   * Obtener métricas actuales
   */
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  /**
   * Obtener todas las métricas
   */
  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Obtener errores recientes
   */
  getRecentErrors(): ErrorInfo[] {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return this.errors.filter(error => error.timestamp > oneHourAgo);
  }

  /**
   * Generar reporte de rendimiento
   */
  generateReport(): {
    summary: any;
    vitals: { avg: WebVitals; p75: WebVitals; p95: WebVitals };
    errors: { total: number; critical: number; recent: number };
    recommendations: string[];
  } {
    if (this.metrics.length === 0) {
      return {
        summary: { status: 'no_data' },
        vitals: {
          avg: { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 },
          p75: { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 },
          p95: { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 },
        },
        errors: { total: 0, critical: 0, recent: 0 },
        recommendations: [],
      };
    }

    const vitalsArray = this.metrics.map(m => m.vitals);
    const recentErrors = this.getRecentErrors();
    const criticalErrors = this.errors.filter(e => this.isCriticalError(e));

    // Calcular promedios y percentiles
    const calculateStats = (values: number[]) => {
      const sorted = values.sort((a, b) => a - b);
      return {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        p75: sorted[Math.floor(sorted.length * 0.75)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
      };
    };

    const lcpStats = calculateStats(vitalsArray.map(v => v.lcp).filter(v => v > 0));
    const fidStats = calculateStats(vitalsArray.map(v => v.fid).filter(v => v > 0));
    const clsStats = calculateStats(vitalsArray.map(v => v.cls).filter(v => v > 0));
    const fcpStats = calculateStats(vitalsArray.map(v => v.fcp).filter(v => v > 0));
    const ttfbStats = calculateStats(vitalsArray.map(v => v.ttfb).filter(v => v > 0));

    const vitals = {
      avg: {
        lcp: lcpStats.avg,
        fid: fidStats.avg,
        cls: clsStats.avg,
        fcp: fcpStats.avg,
        ttfb: ttfbStats.avg,
      },
      p75: {
        lcp: lcpStats.p75,
        fid: fidStats.p75,
        cls: clsStats.p75,
        fcp: fcpStats.p75,
        ttfb: ttfbStats.p75,
      },
      p95: {
        lcp: lcpStats.p95,
        fid: fidStats.p95,
        cls: clsStats.p95,
        fcp: fcpStats.p95,
        ttfb: ttfbStats.p95,
      },
    };

    // Generar recomendaciones
    const recommendations: string[] = [];

    if (vitals.avg.lcp > 2500)
      recommendations.push('Optimizar Largest Contentful Paint (LCP > 2.5s)');
    if (vitals.avg.fid > 100) recommendations.push('Reducir First Input Delay (FID > 100ms)');
    if (vitals.avg.cls > 0.1) recommendations.push('Reducir Cumulative Layout Shift (CLS > 0.1)');
    if (vitals.avg.fcp > 1800)
      recommendations.push('Optimizar First Contentful Paint (FCP > 1.8s)');
    if (vitals.avg.ttfb > 800) recommendations.push('Optimizar Time to First Byte (TTFB > 800ms)');

    if (criticalErrors.length > 0) recommendations.push('Investigar errores críticos del sistema');
    if (recentErrors.length > 5) recommendations.push('Alta tasa de errores recientes');

    return {
      summary: {
        status: this.getPerformanceStatus(vitals.avg),
        metricsCollected: this.metrics.length,
        errorsTotal: this.errors.length,
      },
      vitals,
      errors: {
        total: this.errors.length,
        critical: criticalErrors.length,
        recent: recentErrors.length,
      },
      recommendations,
    };
  }

  /**
   * Determinar estado general del rendimiento
   */
  private getPerformanceStatus(
    vitals: WebVitals
  ): 'excellent' | 'good' | 'needs_improvement' | 'poor' {
    let score = 0;

    if (vitals.lcp < 2500) score++;
    if (vitals.fid < 100) score++;
    if (vitals.cls < 0.1) score++;
    if (vitals.fcp < 1800) score++;
    if (vitals.ttfb < 800) score++;

    if (score === 5) return 'excellent';
    if (score >= 3) return 'good';
    if (score >= 2) return 'needs_improvement';
    return 'poor';
  }
}

// Instancia global del monitor
export const performanceMonitor = new PerformanceMonitor();

// Hook para usar el monitor en React
export function usePerformanceMonitor() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const updateReport = () => {
      setReport(performanceMonitor.generateReport());
    };

    // Actualizar reporte cada 30 segundos
    const interval = setInterval(updateReport, 30000);
    updateReport(); // Reporte inicial

    return () => clearInterval(interval);
  }, []);

  return {
    report,
    start: () => performanceMonitor.start(),
    stop: () => performanceMonitor.stop(),
    getCurrentMetrics: () => performanceMonitor.getCurrentMetrics(),
    getRecentErrors: () => performanceMonitor.getRecentErrors(),
  };
}
