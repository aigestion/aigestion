const CACHE_NAME = 'aigestion-nexus-v5-OPTIMIZED';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.ico'];

// 1. Install Phase - Cache Critical Assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 [SW] Service Worker v5: Caching Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 2. Activate Phase - Clean Old Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) {
              console.log('🗑️ [SW] Clearing Old Cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. Fetch Strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // A. API Requests -> Network Only (Never Cache)
  if (url.pathname.startsWith('/api/') || url.pathname.includes('supabase')) {
    return;
  }

  // B. Navigation (HTML) -> Network First (Prevent Blank Page)
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
    return;
  }

  // C. Static Assets (JS, CSS, Images) -> Stale-While-Revalidate
  // Serve from cache immediately, then update cache in background
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const networkFetch = fetch(event.request).then(networkResponse => {
        // Clone and Cache
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      });

      return cachedResponse || networkFetch;
    })
  );
});
