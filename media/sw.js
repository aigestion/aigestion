// AIGestion Service Worker - God Mode v2.1 (Enhanced Error Handling)
const CACHE_NAME = 'aigestion-v2.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/images/brand/logo.png',
];

// Network error handling
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core assets');
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        return response;
      }

      // For external APIs (like Pollinations), handle CORS errors gracefully
      if (event.request.url.includes('pollinations.ai')) {
        return fetch(event.request).catch(() => {
          console.log('[SW] Pollinations API failed, using fallback');
          // Return a placeholder image or cached alternative
          return new Response('Image generation unavailable', {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      }

      // For other requests, try network then fallback to cache
      return fetch(event.request).catch(() => {
        console.log('[SW] Network failed, trying cache for:', event.request.url);
        return caches.match(event.request);
      });
    }),
  );
});
