// Advanced Service Worker with intelligent caching strategies
const CACHE_VERSION = '2.0.0';
const STATIC_CACHE = `aigestion-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `aigestion-dynamic-${CACHE_VERSION}`;
const RUNTIME_CACHE = `aigestion-runtime-${CACHE_VERSION}`;

// Cache strategies
const CACHE_STRATEGIES = {
  STATIC: 'cache-first',
  DYNAMIC: 'network-first',
  RUNTIME: 'stale-while-revalidate',
  API: 'network-only',
};

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/_next/static/css/app.css',
  '/_next/static/chunks/main.js',
];

// Dynamic assets to cache on demand
const DYNAMIC_PATTERNS = [
  /\.(png|jpg|jpeg|gif|webp|svg)$/i,
  /\.(woff|woff2|ttf|eot)$/i,
  /\.(mp4|webm|ogg)$/i,
  /\.json$/i,
];

// API endpoints
const API_PATTERNS = [
  /\/api\//i,
  /\/supabase\//i,
];

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      networkRequests: 0,
      errors: 0,
    };
  }

  recordCacheHit() {
    this.metrics.cacheHits++;
  }

  recordCacheMiss() {
    this.metrics.cacheMisses++;
  }

  recordNetworkRequest() {
    this.metrics.networkRequests++;
  }

  recordError() {
    this.metrics.errors++;
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

const performanceMonitor = new PerformanceMonitor();

// Cache management utilities
class CacheManager {
  static async openCache(cacheName: string): Promise<Cache> {
    return await caches.open(cacheName);
  }

  static async addToCache(cacheName: string, request: Request, response: Response): Promise<void> {
    const cache = await this.openCache(cacheName);
    await cache.put(request, response.clone());
  }

  static async getFromCache(cacheName: string, request: Request): Promise<Response | null> {
    const cache = await this.openCache(cacheName);
    return await cache.match(request);
  }

  static async deleteCache(cacheName: string): Promise<boolean> {
    return await caches.delete(cacheName);
  }

  static async cleanupOldCaches(): Promise<void> {
    const cacheNames = await caches.keys();
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, RUNTIME_CACHE];
    
    const oldCaches = cacheNames.filter(name => !currentCaches.includes(name));
    await Promise.all(oldCaches.map(name => this.deleteCache(name)));
  }
}

// Request router
class RequestRouter {
  static getStrategy(request: Request): string {
    const url = new URL(request.url);
    
    // API requests
    if (API_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return CACHE_STRATEGIES.API;
    }
    
    // Static assets
    if (CRITICAL_ASSETS.includes(url.pathname)) {
      return CACHE_STRATEGIES.STATIC;
    }
    
    // Dynamic assets
    if (DYNAMIC_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return CACHE_STRATEGIES.DYNAMIC;
    }
    
    // Default to runtime strategy
    return CACHE_STRATEGIES.RUNTIME;
  }

  static isGetRequest(request: Request): boolean {
    return request.method === 'GET';
  }

  static isNavigationRequest(request: Request): boolean {
    return request.mode === 'navigate';
  }
}

// Cache strategy implementations
class CacheStrategies {
  static async cacheFirst(request: Request): Promise<Response> {
    const cachedResponse = await CacheManager.getFromCache(STATIC_CACHE, request);
    
    if (cachedResponse) {
      performanceMonitor.recordCacheHit();
      return cachedResponse;
    }

    performanceMonitor.recordCacheMiss();
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await CacheManager.addToCache(STATIC_CACHE, request, networkResponse);
    }
    
    return networkResponse;
  }

  static async networkFirst(request: Request): Promise<Response> {
    try {
      performanceMonitor.recordNetworkRequest();
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        await CacheManager.addToCache(DYNAMIC_CACHE, request, networkResponse);
      }
      
      return networkResponse;
    } catch (error) {
      performanceMonitor.recordError();
      const cachedResponse = await CacheManager.getFromCache(DYNAMIC_CACHE, request);
      return cachedResponse || new Response('Offline', { status: 503 });
    }
  }

  static async staleWhileRevalidate(request: Request): Promise<Response> {
    const cachedResponse = await CacheManager.getFromCache(RUNTIME_CACHE, request);
    
    if (cachedResponse) {
      performanceMonitor.recordCacheHit();
      
      // Revalidate in background
      this.revalidateInBackground(request);
      return cachedResponse;
    }

    performanceMonitor.recordCacheMiss();
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await CacheManager.addToCache(RUNTIME_CACHE, request, networkResponse);
    }
    
    return networkResponse;
  }

  static async networkOnly(request: Request): Promise<Response> {
    performanceMonitor.recordNetworkRequest();
    return await fetch(request);
  }

  private static async revalidateInBackground(request: Request): Promise<void> {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await CacheManager.addToCache(RUNTIME_CACHE, request, networkResponse);
      }
    } catch (error) {
      console.warn('Background revalidation failed:', error);
    }
  }
}

// Background sync for offline actions
class BackgroundSync {
  static async registerSync(tag: string): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
    }
  }

  static async handleSync(event: SyncEvent): Promise<void> {
    if (event.tag === 'background-sync') {
      event.waitUntil(this.processOfflineActions());
    }
  }

  private static async processOfflineActions(): Promise<void> {
    // Process queued offline actions
    const offlineActions = await this.getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await this.executeAction(action);
        await this.removeOfflineAction(action.id);
      } catch (error) {
        console.error('Failed to execute offline action:', error);
      }
    }
  }

  private static async getOfflineActions(): Promise<any[]> {
    // Get offline actions from IndexedDB
    return [];
  }

  private static async executeAction(action: any): Promise<void> {
    // Execute the action
    await fetch(action.url, action.options);
  }

  private static async removeOfflineAction(id: string): Promise<void> {
    // Remove action from IndexedDB
  }
}

// Push notification handling
class PushNotificationHandler {
  static async handlePush(event: PushEvent): Promise<void> {
    const data = event.data?.json();
    
    if (!data) return;

    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: data.tag,
      data: data.data,
      actions: data.actions,
    };

    await self.registration.showNotification(data.title, options);
  }

  static async handleNotificationClick(event: NotificationEvent): Promise<void> {
    event.notification.close();
    
    const url = event.notification.data?.url || '/';
    await clients.openWindow(url);
  }
}

// Main service worker event handlers
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      const cache = await CacheManager.openCache(STATIC_CACHE);
      await cache.addAll(CRITICAL_ASSETS);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      await CacheManager.cleanupOldCaches();
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  if (!RequestRouter.isGetRequest(event.request)) {
    return;
  }

  const strategy = RequestRouter.getStrategy(event.request);
  
  event.respondWith(
    (async () => {
      try {
        switch (strategy) {
          case CACHE_STRATEGIES.STATIC:
            return await CacheStrategies.cacheFirst(event.request);
          
          case CACHE_STRATEGIES.DYNAMIC:
            return await CacheStrategies.networkFirst(event.request);
          
          case CACHE_STRATEGIES.RUNTIME:
            return await CacheStrategies.staleWhileRevalidate(event.request);
          
          case CACHE_STRATEGIES.API:
            return await CacheStrategies.networkOnly(event.request);
          
          default:
            return await fetch(event.request);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        performanceMonitor.recordError();
        
        // Return offline fallback for navigation requests
        if (RequestRouter.isNavigationRequest(event.request)) {
          return await CacheManager.getFromCache(STATIC_CACHE, new Request('/')) ||
                 new Response('Offline - No cached version available', { status: 503 });
        }
        
        throw error;
      }
    })()
  );
});

self.addEventListener('sync', (event: SyncEvent) => {
  BackgroundSync.handleSync(event);
});

self.addEventListener('push', (event: PushEvent) => {
  PushNotificationHandler.handlePush(event);
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  PushNotificationHandler.handleNotificationClick(event);
});

// Message handling for cache management
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_METRICS') {
    event.ports[0].postMessage(performanceMonitor.getMetrics());
  }
});

// Export for testing
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    caches.keys().then(keys => {
      event.ports[0].postMessage({ caches: keys });
    });
  }
});
