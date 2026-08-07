const CACHE_NAME = 'bg-remover-cache-v1';

// Add the assets you want to cache for offline availability / fast loading
const ASSETS_TO_CACHE = [
  '/',
  '/index.html?v1',
  '/manifest.json?v1',
  '/icon.png?v1',
  '/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css?v1',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js?v1',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js?v1',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Don't cache Cloudinary API calls or third party images
          if(event.request.url.startsWith('http') && !event.request.url.includes('cloudinary')) {
              cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      });
    }).catch(() => {
        // Fallback behavior if both cache and network fail
        return new Response('Network error occurred.');
    })
  );
});