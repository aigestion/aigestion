// ============================================
// CRITICAL PRELOADER
// Sistema de precarga inteligente para componentes críticos
// ============================================

export interface PreloadConfig {
  priority: 'critical' | 'high' | 'medium' | 'low';
  trigger: 'immediate' | 'idle' | 'hover' | 'visible' | 'network';
  timeout?: number;
  retryCount?: number;
  fallback?: () => void;
}

export interface PreloadTask {
  id: string;
  importFn: () => Promise<any>;
  config: PreloadConfig;
  status: 'pending' | 'loading' | 'loaded' | 'failed' | 'cancelled';
  startTime?: number;
  endTime?: number;
  error?: Error | undefined;
  retryCount: number;
}

export interface PreloadMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageLoadTime: number;
  totalLoadTime: number;
  criticalTasksLoaded: number;
  highPriorityTasksLoaded: number;
}

// ============================================
// CRITICAL PRELOADER CLASS
// Maneja precarga de componentes críticos con múltiples estrategias
// ============================================

export class CriticalPreloader {
  private static instance: CriticalPreloader;
  private tasks = new Map<string, PreloadTask>();
  private observers = new Map<string, IntersectionObserver>();
  private networkListeners = new Set<() => void>();
  private metrics: PreloadMetrics = {
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageLoadTime: 0,
    totalLoadTime: 0,
    criticalTasksLoaded: 0,
    highPriorityTasksLoaded: 0,
  };

  static getInstance(): CriticalPreloader {
    if (!CriticalPreloader.instance) {
      CriticalPreloader.instance = new CriticalPreloader();
    }
    return CriticalPreloader.instance;
  }

  // ============================================
  // TASK MANAGEMENT
  // ============================================

  registerTask(id: string, importFn: () => Promise<any>, config: PreloadConfig): void {
    const task: PreloadTask = {
      id,
      importFn,
      config,
      status: 'pending',
      retryCount: 0,
    };

    this.tasks.set(id, task);
    this.metrics.totalTasks++;

    // Schedule preload based on trigger
    this.schedulePreload(task);
  }

  private schedulePreload(task: PreloadTask): void {
    switch (task.config.trigger) {
      case 'immediate':
        this.executeTask(task);
        break;
      case 'idle':
        this.scheduleIdleTask(task);
        break;
      case 'hover':
        // Hover trigger handled by component
        break;
      case 'visible':
        this.scheduleVisibilityTask(task);
        break;
      case 'network':
        this.scheduleNetworkTask(task);
        break;
    }
  }

  private async executeTask(task: PreloadTask): Promise<void> {
    if (task.status !== 'pending') return;

    task.status = 'loading';
    task.startTime = performance.now();

    try {
      const timeout = task.config.timeout || 10000;
      await Promise.race([
        task.importFn(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Preload timeout')), timeout)),
      ]);

      task.status = 'loaded';
      task.endTime = performance.now();

      this.updateMetrics(task);

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Preloaded: ${task.id} (${task.endTime - task.startTime}ms)`);
      }
    } catch (error) {
      task.error = error as Error;
      task.endTime = performance.now();

      if (task.retryCount < (task.config.retryCount || 2)) {
        task.retryCount++;
        task.status = 'pending';

        // Exponential backoff
        const delay = Math.pow(2, task.retryCount) * 1000;
        setTimeout(() => this.executeTask(task), delay);
      } else {
        task.status = 'failed';
        this.updateMetrics(task);

        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ Preload failed: ${task.id}`, error);
        }

        // Execute fallback if available
        if (task.config.fallback) {
          task.config.fallback();
        }
      }
    }
  }

  private scheduleIdleTask(task: PreloadTask): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.executeTask(task), { timeout: 5000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => this.executeTask(task), 100);
    }
  }

  private scheduleVisibilityTask(_task: PreloadTask): void {
    // This would be called by components with visibility triggers
    // Implementation depends on specific use case
  }

  private scheduleNetworkTask(task: PreloadTask): void {
    const checkNetworkAndLoad = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const isGoodConnection =
          !connection.saveData &&
          (connection.effectiveType === '4g' ||
            connection.effectiveType === '3g' ||
            connection.effectiveType === '2g');

        if (isGoodConnection) {
          this.executeTask(task);
        } else {
          // Retry when connection improves
          const listener = () => {
            const newConnection = (navigator as any).connection;
            if (
              !newConnection.saveData &&
              (newConnection.effectiveType === '4g' ||
                newConnection.effectiveType === '3g' ||
                newConnection.effectiveType === '2g')
            ) {
              this.executeTask(task);
              this.removeNetworkListener(listener);
            }
          };
          this.addNetworkListener(listener);
        }
      } else {
        // No connection API, load anyway
        this.executeTask(task);
      }
    };

    checkNetworkAndLoad();
  }

  private addNetworkListener(listener: () => void): void {
    this.networkListeners.add(listener);
    // In a real implementation, you'd listen to connection change events
  }

  private removeNetworkListener(listener: () => void): void {
    this.networkListeners.delete(listener);
  }

  // ============================================
  // TRIGGER METHODS
  // ============================================

  triggerHover(id: string): void {
    const task = this.tasks.get(id);
    if (task && task.config.trigger === 'hover' && task.status === 'pending') {
      this.executeTask(task);
    }
  }

  triggerVisible(id: string, element: HTMLElement): void {
    const task = this.tasks.get(id);
    if (!task || task.config.trigger !== 'visible' || task.status !== 'pending') {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.executeTask(task);
            observer.disconnect();
            this.observers.delete(id);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    this.observers.set(id, observer);
  }

  // ============================================
  // METRICS AND MONITORING
  // ============================================

  private updateMetrics(task: PreloadTask): void {
    if (task.status === 'loaded') {
      this.metrics.completedTasks++;

      if (task.config.priority === 'critical') {
        this.metrics.criticalTasksLoaded++;
      } else if (task.config.priority === 'high') {
        this.metrics.highPriorityTasksLoaded++;
      }

      if (task.startTime && task.endTime) {
        const loadTime = task.endTime - task.startTime;
        this.metrics.totalLoadTime += loadTime;
        this.metrics.averageLoadTime = this.metrics.totalLoadTime / this.metrics.completedTasks;
      }
    } else if (task.status === 'failed') {
      this.metrics.failedTasks++;
    }
  }

  getMetrics(): PreloadMetrics {
    return { ...this.metrics };
  }

  getTaskStatus(id: string): PreloadTask | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): PreloadTask[] {
    return Array.from(this.tasks.values());
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  cancelTask(id: string): boolean {
    const task = this.tasks.get(id);
    if (task && task.status === 'pending') {
      task.status = 'cancelled';

      // Clean up observers
      const observer = this.observers.get(id);
      if (observer) {
        observer.disconnect();
        this.observers.delete(id);
      }

      return true;
    }
    return false;
  }

  retryTask(id: string): boolean {
    const task = this.tasks.get(id);
    if (task && task.status === 'failed') {
      task.status = 'pending';
      task.retryCount = 0;
      task.error = undefined;
      this.schedulePreload(task);
      return true;
    }
    return false;
  }

  clearCompletedTasks(): void {
    for (const [id, task] of this.tasks.entries()) {
      if (task.status === 'loaded' || task.status === 'failed') {
        this.tasks.delete(id);
      }
    }
  }

  destroy(): void {
    // Clean up all observers
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();

    // Clear network listeners
    this.networkListeners.clear();

    // Clear tasks
    this.tasks.clear();
  }
}

// ============================================
// REACT HOOKS
// Hooks para usar el preloader en componentes React
// ============================================

import { useCallback, useEffect, useRef } from 'react';

export function useCriticalPreload() {
  const preloader = CriticalPreloader.getInstance();

  const preload = useCallback(
    (id: string, importFn: () => Promise<any>, config: PreloadConfig) => {
      preloader.registerTask(id, importFn, config);
    },
    [preloader]
  );

  const triggerHover = useCallback(
    (id: string) => {
      preloader.triggerHover(id);
    },
    [preloader]
  );

  const triggerVisible = useCallback(
    (id: string, element: HTMLElement) => {
      preloader.triggerVisible(id, element);
    },
    [preloader]
  );

  const getStatus = useCallback(
    (id: string) => {
      return preloader.getTaskStatus(id);
    },
    [preloader]
  );

  const getMetrics = useCallback(() => {
    return preloader.getMetrics();
  }, [preloader]);

  return {
    preload,
    triggerHover,
    triggerVisible,
    getStatus,
    getMetrics,
  };
}

export function usePreloadOnHover(
  id: string,
  importFn: () => Promise<any>,
  config: Omit<PreloadConfig, 'trigger'> = { priority: 'medium' }
) {
  const { preload, triggerHover } = useCriticalPreload();
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Register the task with hover trigger
    preload(id, importFn, { ...config, trigger: 'hover' });
  }, [id, importFn, config, preload]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => triggerHover(id);
    element.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [id, triggerHover]);

  return elementRef;
}

export function usePreloadOnVisible(
  id: string,
  importFn: () => Promise<any>,
  config: Omit<PreloadConfig, 'trigger'> = { priority: 'medium' }
) {
  const { preload, triggerVisible } = useCriticalPreload();
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Register the task with visibility trigger
    preload(id, importFn, { ...config, trigger: 'visible' });
  }, [id, importFn, config, preload]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    triggerVisible(id, element);

    return () => {
      // Cleanup will be handled by the preloader
    };
  }, [id, triggerVisible]);

  return elementRef;
}

// ============================================
// PRELOAD CONFIGURATIONS
// Configuraciones predefinidas para diferentes casos de uso
// ============================================

export const PRELOAD_CONFIGS = {
  // Componentes críticos que deben cargarse inmediatamente
  CRITICAL: {
    priority: 'critical' as const,
    trigger: 'immediate' as const,
    timeout: 5000,
    retryCount: 3,
  },

  // Componentes importantes que pueden esperar a idle time
  HIGH_PRIORITY: {
    priority: 'high' as const,
    trigger: 'idle' as const,
    timeout: 8000,
    retryCount: 2,
  },

  // Componentes que se cargan en hover
  ON_HOVER: {
    priority: 'medium' as const,
    trigger: 'hover' as const,
    timeout: 3000,
    retryCount: 1,
  },

  // Componentes que se cargan cuando son visibles
  ON_VISIBLE: {
    priority: 'medium' as const,
    trigger: 'visible' as const,
    timeout: 5000,
    retryCount: 2,
  },

  // Componentes que esperan a buena conexión
  NETWORK_DEPENDENT: {
    priority: 'low' as const,
    trigger: 'network' as const,
    timeout: 10000,
    retryCount: 1,
  },
} as const;

// ============================================
// CRITICAL COMPONENTS REGISTRATION
// Registro de componentes críticos para la aplicación
// ============================================

export function registerCriticalComponents(): void {
  const preloader = CriticalPreloader.getInstance();

  // Componentes críticos del hero
  preloader.registerTask(
    'cinematic-experience',
    () => import('../components/CinematicExperience'),
    PRELOAD_CONFIGS.CRITICAL
  );

  preloader.registerTask(
    'daniela-showcase',
    () => import('../components/DanielaShowcase'),
    PRELOAD_CONFIGS.CRITICAL
  );

  // Componentes importantes de dashboard
  preloader.registerTask(
    'admin-dashboard',
    () => import('../components/AdminDashboard'),
    PRELOAD_CONFIGS.HIGH_PRIORITY
  );

  preloader.registerTask(
    'client-dashboard',
    () => import('../components/ClientDashboard'),
    PRELOAD_CONFIGS.HIGH_PRIORITY
  );

  // Componentes de auth
  preloader.registerTask('login', () => import('../pages/Login'), PRELOAD_CONFIGS.ON_HOVER);

  preloader.registerTask(
    'register',
    () => import('../components/auth/Register'),
    PRELOAD_CONFIGS.ON_HOVER
  );

  // Componentes pesados
  preloader.registerTask(
    'sovereign-intelligence',
    () => import('../components/SovereignIntelligenceHub'),
    PRELOAD_CONFIGS.NETWORK_DEPENDENT
  );

  preloader.registerTask(
    'workbench-layout',
    () => import('../components/workbench/WorkbenchLayout'),
    PRELOAD_CONFIGS.NETWORK_DEPENDENT
  );

  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Critical Components Registered for Preloading');
  }
}

// ============================================
// INITIALIZATION
// ============================================

export function initializeCriticalPreloader(): void {
  registerCriticalComponents();

  if (process.env.NODE_ENV === 'development') {
    // Log preload metrics every 10 seconds in development
    setInterval(() => {
      const metrics = CriticalPreloader.getInstance().getMetrics();
      console.log('📊 Preload Metrics:', metrics);
    }, 10000);
  }
}

// Auto-initialization
initializeCriticalPreloader();
