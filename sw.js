const CACHE_NAME = 'bahith-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/home/index.html',
  '/home/manifest.json',
  '/images/logo-vertical.png',
  '/images/icon-512x512.png',
  '/images/maskable-icon-512x512.png'
];

// Install: Cache essential resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate: Remove old caches if any
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Start controlling clients ASAP
});

// Fetch: Serve from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
