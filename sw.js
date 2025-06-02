const CACHE_NAME = 'pwa-cache-v1';
const ASSETS_TO_CACHE = [
  '/home/',
  '/home/search.html',
  '/home/index.html',
  '/home/manifest.json',
  '/images/icon-96x96.png',
  '/images/icon-72x72.png',
  '/images/icon-512x512.png',
  '/images/icon-96x96.png',
  '/images/icon-192x192.png',
  '/images/icon-152x152.png',
  '/images/icon-144x144.png',
  '/images/icon-128x128.png',
  '/images/home.svg',
  '/images/search.svg',
  '/images/favicon.png',
  '/images/logo-mask.png',
  '/images/logo-vertical.png',
  '/images/logo-mask.png',
  '/icons/maskable-icon-512x512.png'
];

// On install: pre-cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate the new service worker immediately
});

// On activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Take control of clients immediately
});

// On fetch: try cache first, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // Optionally cache new requests
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
