// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(reg => console.log('ServiceWorker registered.', reg))
      .catch(err => console.error('ServiceWorker registration failed:', err));
  });
}

// serviceWorker.js (placed in public folder)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('aigestion-static-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/main.tsx',
        '/src/styles/index.css',
        // Add icons
        '/icons/icon-48x48.png',
        '/icons/icon-72x72.png',
        '/icons/icon-96x96.png',
        '/icons/icon-144x144.png',
        '/icons/icon-192x192.png',
        '/icons/icon-256x256.png',
        '/icons/icon-384x384.png',
        '/icons/icon-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
