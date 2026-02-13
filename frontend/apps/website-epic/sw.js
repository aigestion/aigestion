const CACHE_NAME = 'aigestion-nexus-v4-STABLE';
const ASSETS_TO_CACHE = ['/', '/index.html', '/favicon.ico'];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force activation immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Service Worker v4: Caching critical assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('🚀 Service Worker v4: Activating & Cleaning old caches');
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Network-first for HTML, Cache-first for assets
      if (event.request.mode === 'navigate') {
        return fetch(event.request).catch(() => {
          // If network fails, try to serve from cache
          return response;
        });
      }

      // For other requests, try cache first, then network
      if (response) {
        return response;
      }

      // If not in cache, try network (with error handling)
      return fetch(event.request).catch(() => {
        // Return a basic response for failed requests
        if (event.request.destination === 'script' || event.request.destination === 'style') {
          return new Response('', { status: 200, statusText: 'OK' });
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
