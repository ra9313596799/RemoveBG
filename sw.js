const CACHE_NAME = 'RemoveBG-v1';
const urlsToCache = [
  '/RemoveBG/',
  '/RemoveBG/index.html',
  // Agar aapki css ya js files hain, toh unka naam bhi yahan dalein jaise:
  // '/RemoveBG/style.css',
  // '/RemoveBG/script.js'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetching from Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});