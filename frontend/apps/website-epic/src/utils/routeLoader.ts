import { lazy } from 'react';

// ============================================
// ROUTE-BASED CODE SPLITTING
// Optimizado para carga bajo demanda por rutas
// ============================================

// Dashboard Routes - Split por tipo de usuario
export const AdminDashboard = lazy(() => 
  import('../components/AdminDashboard').then(module => ({
    default: module.AdminDashboard
  }))
);

export const ClientDashboard = lazy(() => 
  import('../components/ClientDashboard').then(module => ({
    default: module.ClientDashboard
  }))
);

export const DemoDashboard = lazy(() => 
  import('../components/DemoDashboard').then(module => ({
    default: module.DemoDashboard
  }))
);

// Authentication Routes - Split por flujo de auth
export const Login = lazy(() => 
  import('../pages/Login').then(module => ({
    default: module.Login
  }))
);

export const Register = lazy(() => 
  import('../components/auth/Register').then(module => ({
    default: module.Register
  }))
);

export const EmailVerification = lazy(() => 
  import('../components/auth/EmailVerification').then(module => ({
    default: module.EmailVerification
  }))
);

export const PhoneVerification = lazy(() => 
  import('../components/auth/PhoneVerification').then(module => ({
    default: module.PhoneVerification
  }))
);

// Subscription Routes - Split por flujo de pago
export const SubscriptionPage = lazy(() => 
  import('../pages/SubscriptionPage').then(module => ({
    default: module.default
  }))
);

export const PaymentGateway = lazy(() => 
  import('../components/subscription/PaymentGateway').then(module => ({
    default: module.PaymentGateway
  }))
);

export const BillingDashboard = lazy(() => 
  import('../pages/BillingDashboard').then(module => ({
    default: module.BillingDashboard
  }))
);

// Feature Routes - Split por funcionalidad
export const WeaponDashboard = lazy(() => 
  import('../pages/WeaponDashboard').then(module => ({
    default: module.default
  }))
);

export const MissionControl = lazy(() => 
  import('../pages/MissionControl').then(module => ({
    default: module.default
  }))
);

export const Marketplace = lazy(() => 
  import('../pages/Marketplace').then(module => ({
    default: module.default
  }))
);

export const SovereignIntelligenceHub = lazy(() => 
  import('../components/SovereignIntelligenceHub').then(module => ({
    default: module.SovereignIntelligenceHub
  }))
);

// Legal Routes - Split por tipo legal
export const PrivacyPolicy = lazy(() => 
  import('../pages/PrivacyPolicy').then(module => ({
    default: module.default
  }))
);

export const TermsOfUse = lazy(() => 
  import('../pages/TermsOfUse').then(module => ({
    default: module.default
  }))
);

// Special Routes - Split por casos especiales
export const VirtualOfficePreview = lazy(() => 
  import('../pages/VirtualOfficePreview').then(module => ({
    default: module.default
  }))
);

export const DanielaDemo = lazy(() => 
  import('../pages/DanielaDemo').then(module => ({
    default: module.DanielaDemo
  }))
);

export const Maintenance = lazy(() => 
  import('../pages/Maintenance').then(module => ({
    default: module.Maintenance
  }))
);

// ============================================
// PRELOAD FUNCTIONS
// Para precarga inteligente de componentes
// ============================================

export const preloadDashboardRoutes = () => {
  // Preload dashboards cuando el usuario está autenticado
  if (localStorage.getItem('isAuthenticated') === 'true') {
    import('../components/AdminDashboard');
    import('../components/ClientDashboard');
    import('../components/DemoDashboard');
  }
};

export const preloadAuthRoutes = () => {
  // Preload auth components en hover de login/register
  import('../pages/Login');
  import('../components/auth/Register');
  import('../components/auth/EmailVerification');
};

export const preloadCriticalRoutes = () => {
  // Preload rutas críticas en idle time
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('../components/CinematicExperience');
      import('../components/DanielaShowcase');
      import('../components/NexusAndroid');
    });
  } else {
    // Fallback para navegadores sin requestIdleCallback
    setTimeout(() => {
      import('../components/CinematicExperience');
      import('../components/DanielaShowcase');
      import('../components/NexusAndroid');
    }, 2000);
  }
};

// ============================================
// CHUNK LOADING UTILITIES
// Para manejo de errores y estados de carga
// ============================================

export interface ChunkLoadState {
  isLoading: boolean;
  hasError: boolean;
  retryCount: number;
}

export class ChunkLoadManager {
  private static instance: ChunkLoadManager;
  private loadingStates = new Map<string, ChunkLoadState>();
  private maxRetries = 3;
  private retryDelay = 1000;

  static getInstance(): ChunkLoadManager {
    if (!ChunkLoadManager.instance) {
      ChunkLoadManager.instance = new ChunkLoadManager();
    }
    return ChunkLoadManager.instance;
  }

  getLoadState(chunkName: string): ChunkLoadState {
    return this.loadingStates.get(chunkName) || {
      isLoading: false,
      hasError: false,
      retryCount: 0
    };
  }

  setLoading(chunkName: string, isLoading: boolean): void {
    const currentState = this.getLoadState(chunkName);
    this.loadingStates.set(chunkName, {
      ...currentState,
      isLoading
    });
  }

  setError(chunkName: string, hasError: boolean): void {
    const currentState = this.getLoadState(chunkName);
    this.loadingStates.set(chunkName, {
      ...currentState,
      hasError
    });
  }

  async retryLoad(chunkName: string, loadFunction: () => Promise<any>): Promise<any> {
    const currentState = this.getLoadState(chunkName);
    
    if (currentState.retryCount >= this.maxRetries) {
      throw new Error(`Max retries exceeded for chunk: ${chunkName}`);
    }

    this.setLoading(chunkName, true);
    this.setError(chunkName, false);

    try {
      const result = await loadFunction();
      this.loadingStates.delete(chunkName); // Reset on success
      return result;
    } catch (error) {
      const retryCount = currentState.retryCount + 1;
      this.loadingStates.set(chunkName, {
        isLoading: false,
        hasError: true,
        retryCount
      });

      if (retryCount < this.maxRetries) {
        console.warn(`Chunk ${chunkName} failed, retrying (${retryCount}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * retryCount));
        return this.retryLoad(chunkName, loadFunction);
      }

      throw error;
    }
  }
}

// ============================================
// LAZY LOADING WRAPPER
// Wrapper con manejo de errores y retry
// ============================================

export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  chunkName: string,
  options: {
    fallback?: React.ComponentType;
    retryable?: boolean;
    preload?: boolean;
  } = {}
): React.LazyExoticComponent<T> {
  const chunkManager = ChunkLoadManager.getInstance();

  if (options.preload) {
    // Preload in idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFunc());
    } else {
      setTimeout(() => importFunc(), 1000);
    }
  }

  return lazy(() => {
    if (options.retryable) {
      return chunkManager.retryLoad(chunkName, importFunc);
    }
    return importFunc();
  });
}

// ============================================
// ROUTE PREDICTION
// Predicción de rutas basada en comportamiento
// ============================================

export class RoutePredictor {
  private static instance: RoutePredictor;
  private routeFrequency = new Map<string, number>();
  private lastRoutes: string[] = [];
  private maxHistorySize = 10;

  static getInstance(): RoutePredictor {
    if (!RoutePredictor.instance) {
      RoutePredictor.instance = new RoutePredictor();
    }
    return RoutePredictor.instance;
  }

  recordRoute(route: string): void {
    // Actualizar frecuencia
    const currentFreq = this.routeFrequency.get(route) || 0;
    this.routeFrequency.set(route, currentFreq + 1);

    // Actualizar historial
    this.lastRoutes.unshift(route);
    if (this.lastRoutes.length > this.maxHistorySize) {
      this.lastRoutes.pop();
    }

    // Predecir y precargar siguiente ruta
    this.predictAndPreload();
  }

  private predictAndPreload(): void {
    const predictions = this.getPredictedRoutes();
    predictions.forEach(route => {
      this.preloadRoute(route);
    });
  }

  private getPredictedRoutes(): string[] {
    // Simple prediction basada en frecuencia y patrones
    const sortedRoutes = Array.from(this.routeFrequency.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([route]) => route);

    return sortedRoutes;
  }

  private preloadRoute(route: string): void {
    const routeMap: Record<string, () => Promise<any>> = {
      '/admin': () => import('../components/AdminDashboard'),
      '/client': () => import('../components/ClientDashboard'),
      '/demo': () => import('../components/DemoDashboard'),
      '/pricing': () => import('../pages/SubscriptionPage'),
      '/billing': () => import('../pages/BillingDashboard'),
      '/marketplace': () => import('../pages/Marketplace'),
      '/missions': () => import('../pages/MissionControl'),
      '/weapon': () => import('../pages/WeaponDashboard'),
      '/intelligence': () => import('../components/SovereignIntelligenceHub'),
    };

    const importFunc = routeMap[route];
    if (importFunc) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => importFunc());
      } else {
        setTimeout(() => importFunc(), 100);
      }
    }
  }
}

// ============================================
// PERFORMANCE MONITORING
// Monitoreo de performance de chunks
// ============================================

export interface ChunkMetrics {
  chunkName: string;
  loadTime: number;
  size: number;
  retryCount: number;
  success: boolean;
}

export class ChunkPerformanceMonitor {
  private static instance: ChunkPerformanceMonitor;
  private metrics: ChunkMetrics[] = [];

  static getInstance(): ChunkPerformanceMonitor {
    if (!ChunkPerformanceMonitor.instance) {
      ChunkPerformanceMonitor.instance = new ChunkPerformanceMonitor();
    }
    return ChunkPerformanceMonitor.instance;
  }

  recordMetric(metric: ChunkMetrics): void {
    this.metrics.push(metric);
    
    // Log performance warnings
    if (metric.loadTime > 3000) {
      console.warn(`Slow chunk load: ${metric.chunkName} took ${metric.loadTime}ms`);
    }
    
    if (metric.retryCount > 0) {
      console.warn(`Chunk ${metric.chunkName} required ${metric.retryCount} retries`);
    }
  }

  getMetrics(): ChunkMetrics[] {
    return [...this.metrics];
  }

  getAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, m) => sum + m.loadTime, 0);
    return total / this.metrics.length;
  }

  getSlowestChunks(limit: number = 5): ChunkMetrics[] {
    return this.metrics
      .sort((a, b) => b.loadTime - a.loadTime)
      .slice(0, limit);
  }
}

// ============================================
// INITIALIZATION
// Inicialización del sistema de route loading
// ============================================

export function initializeRouteLoading(): void {
  // Iniciar predicción de rutas
  const routePredictor = RoutePredictor.getInstance();
  
  // Precargar rutas críticas
  preloadCriticalRoutes();
  
  // Configurar monitoring
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Route Loading System Initialized');
  }
}

// Auto-inicialización
initializeRouteLoading();
