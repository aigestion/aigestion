/**
 * Enhanced Service Worker - PWA Offline First
 * Service Worker avanzado para AIGestion con estrategia offline-first
 */

// Tipos para Service Worker
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'aigestion-v2.0.0';
const STATIC_CACHE = 'aigestion-static-v2.0.0';
const DYNAMIC_CACHE = 'aigestion-dynamic-v2.0.0';
const API_CACHE = 'aigestion-api-v2.0.0';

// Assets críticos que deben cachearse
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index-DYEYyyjA.js',
  '/assets/index-_kIjjvHf.css',
  '/assets/vendor-BIF_SMrh.js',
  '/assets/ui-B9xyW_2r.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/apple-touch-icon.png',
];

// API endpoints para cachear
const API_ENDPOINTS = ['/api/user/profile', '/api/dashboard/stats', '/api/content/features'];

// Estrategias de caché
const CACHE_STRATEGIES = {
  // Cache First para assets estáticos
  CACHE_FIRST: async (request: Request): Promise<Response> => {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);

    if (cached) {
      // Actualizar en background
      updateCacheInBackground(request, cache);
      return cached;
    }

    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      // Fallback para offline
      return getOfflineFallback(request);
    }
  },

  // Network First para API
  NETWORK_FIRST: async (request: Request): Promise<Response> => {
    const cache = await caches.open(API_CACHE);

    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }
      return getOfflineFallback(request);
    }
  },

  // Stale While Revalidate para contenido dinámico
  STALE_WHILE_REVALIDATE: async (request: Request): Promise<Response> => {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);

    // Devolver versión cacheada inmediatamente
    const fetchPromise = fetch(request)
      .then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      })
      .catch(() => {
        // Si falla, mantener la versión cacheada
      });

    return cached || ((await fetchPromise) as Response);
  },
};

// Instalación del Service Worker
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('🔧 Installing Service Worker v2.0.0');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(CRITICAL_ASSETS);

      // Precargar componentes críticos
      await precacheCriticalComponents();

      console.log('✅ Service Worker installed successfully');
    })()
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('🚀 Activating Service Worker v2.0.0');

  event.waitUntil(
    (async () => {
      // Limpiar caches antiguos
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(
        name =>
          name !== STATIC_CACHE &&
          name !== DYNAMIC_CACHE &&
          name !== API_CACHE &&
          name.startsWith('aigestion-')
      );

      await Promise.all(oldCaches.map(name => caches.delete(name)));

      console.log('🧹 Old caches cleaned up');
    })()
  );
});

// Manejo de peticiones fetch
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar peticiones HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }

  // Ignorar peticiones de análisis y tracking
  if (
    url.pathname.includes('/analytics') ||
    url.hostname.includes('google-analytics.com') ||
    url.hostname.includes('googletagmanager.com')
  ) {
    return;
  }

  event.respondWith(handleRequest(request));
});

// Manejo de mensajes
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;

    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    case 'SYNC_DATA':
      syncData(payload).then(result => {
        event.ports[0].postMessage(result);
      });
      break;
  }
});

// Sincronización en background
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Notificaciones push
self.addEventListener('push', (event: PushEvent) => {
  const options = {
    body: event.data?.text() || 'Nueva actualización en AIGestion',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Explorar',
        icon: '/icons/checkmark.png',
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/xmark.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification('AIGestion', options));
});

// Manejo de clic en notificaciones
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(self.clients.openWindow('/'));
  }
});

/**
 * Manejar peticiones según estrategia
 */
async function handleRequest(request: Request): Promise<Response> {
  // Assets estáticos - Cache First
  if (isStaticAsset(request)) {
    return CACHE_STRATEGIES.CACHE_FIRST(request);
  }

  // API endpoints - Network First
  if (isAPIRequest(request)) {
    return CACHE_STRATEGIES.NETWORK_FIRST(request);
  }

  // Contenido dinámico - Stale While Revalidate
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE(request);
}

/**
 * Determinar si es un asset estático
 */
function isStaticAsset(request: Request): boolean {
  const url = new URL(request.url);
  const staticExtensions = [
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.ico',
    '.woff',
    '.woff2',
  ];

  return (
    staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
    url.pathname === '/' ||
    CRITICAL_ASSETS.includes(url.pathname)
  );
}

/**
 * Determinar si es una petición API
 */
function isAPIRequest(request: Request): boolean {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith('/api/') ||
    API_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint))
  );
}

/**
 * Actualizar caché en background
 */
async function updateCacheInBackground(request: Request, cache: Cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response);
    }
  } catch (error) {
    console.log('Background update failed:', error);
  }
}

/**
 * Obtener fallback offline
 */
async function getOfflineFallback(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // Fallback para página principal
  if (url.pathname === '/' || url.pathname.includes('/dashboard')) {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match('/index.html');
    if (cached) {
      return cached;
    }
  }

  // Fallback para imágenes
  if (request.destination === 'image') {
    return new Response(
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ddd"/><text x="50" y="50" text-anchor="middle" dy=".3em">📱</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }

  // Fallback genérico
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'No hay conexión a internet. Por favor, verifica tu conexión.',
      cached: true,
    }),
    {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Precargar componentes críticos
 */
async function precacheCriticalComponents() {
  const criticalComponents = [
    '/components/CinematicPresentation',
    '/components/DanielaShowcase',
    '/components/Navigation',
  ];

  const cache = await caches.open(DYNAMIC_CACHE);

  for (const component of criticalComponents) {
    try {
      const response = await fetch(component);
      if (response.ok) {
        cache.put(component, response);
      }
    } catch (error) {
      console.log(`Failed to precache ${component}:`, error);
    }
  }
}

/**
 * Limpiar todos los caches
 */
async function clearAllCaches(): Promise<void> {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

/**
 * Sincronizar datos offline
 */
async function syncOfflineData(): Promise<void> {
  // Obtener datos guardados en IndexedDB
  const offlineData = await getOfflineData();

  for (const data of offlineData) {
    try {
      await fetch(data.url, {
        method: data.method,
        headers: data.headers,
        body: data.body,
      });

      // Eliminar datos sincronizados
      await removeOfflineData(data.id);
    } catch (error) {
      console.log('Sync failed for data:', data.id, error);
    }
  }
}

/**
 * Obtener datos offline de IndexedDB
 */
async function getOfflineData(): Promise<any[]> {
  // Implementar IndexedDB para almacenamiento offline
  return [];
}

/**
 * Eliminar datos offline sincronizados
 */
async function removeOfflineData(_id: string): Promise<void> {
  // Implementar eliminación de IndexedDB
}

/**
 * Sincronizar datos específicos
 */
async function syncData(_payload: any): Promise<{ success: boolean; error?: string }> {
  try {
    await syncOfflineData();
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Exportar para uso en otros módulos
export { CACHE_NAME, CACHE_STRATEGIES };
