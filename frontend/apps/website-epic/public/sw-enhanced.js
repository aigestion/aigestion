// Enhanced Service Worker for AIGestion Frontend
// Advanced caching strategies and offline support

const CACHE_NAME = 'aigestion-v2';
const STATIC_CACHE = 'aigestion-static-v2';
const DYNAMIC_CACHE = 'aigestion-dynamic-v2';
const API_CACHE = 'aigestion-api-v2';

// Cache strategies
const CACHE_STRATEGIES = {
  STATIC: ['cache-first'],
  DYNAMIC: ['network-first'],
  API: ['network-first', 'cache-fallback'],
  CRITICAL: ['cache-first', 'network-fallback'],
};

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/client.html',
  '/demo.html',
  '/manifest.json',
  // Critical CSS and JS will be added dynamically
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/user',
  '/api/dashboard',
  '/api/analytics',
];

// Network timeout for API requests
const NETWORK_TIMEOUT = 3000;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Cache cleanup completed');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (except CDN)
  if (url.origin !== location.origin && !url.hostname.includes('cdn')) {
    return;
  }

  // Route requests to appropriate strategy
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2)$/)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache strategy: Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Update cache in background
      fetch(request)
        .then(async response => {
          if (response.status === 200) {
            const cache = await caches.open(cacheName);
            await cache.put(request, response.clone());
          }
        })
        .catch(() => {
          // Ignore network errors for cache-first strategy
        });
      
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Cache strategy: Network First
async function networkFirst(request, cacheName) {
  try {
    // Try network first with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT)
      )
    ]);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Network failed, trying cache:', error.message);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html') || 
             new Response('Offline - No cached version available', { status: 503 });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Cache strategy: Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to update cache
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Return cached version if network fails
    return cachedResponse;
  });
  
  // Return cached version immediately, or wait for network if no cache
  return cachedResponse || fetchPromise;
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Get failed requests from IndexedDB
  const failedRequests = await getFailedRequests();
  
  for (const request of failedRequests) {
    try {
      await fetch(request);
      await removeFailedRequest(request);
    } catch (error) {
      console.log('Background sync failed for request:', error);
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New notification from AIGestion',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('AIGestion', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('https://aigestion.net')
    );
  }
});

// Periodic background sync (for cache updates)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-update') {
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  try {
    // Update critical assets
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(STATIC_ASSETS);
    console.log('🔄 Cache updated successfully');
  } catch (error) {
    console.error('❌ Cache update failed:', error);
  }
}

// Helper functions for IndexedDB operations
async function getFailedRequests() {
  // Implementation for storing failed requests in IndexedDB
  return [];
}

async function removeFailedRequest(request) {
  // Implementation for removing failed requests from IndexedDB
}

// Message handling for manual cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(updateCache());
  }
});

// Periodic background sync (for cache updates)
console.log('🚀 Enhanced Service Worker loaded successfully');
