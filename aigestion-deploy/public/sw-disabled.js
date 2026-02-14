// Service Worker DISABLED - CORS issues blocking
// This file prevents SW registration while fixing CORS issues

console.log('[SW] Service Worker disabled due to CORS policy issues');

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Clear all caches
  caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  });
});
