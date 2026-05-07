const CACHE_NAME = 'monimed-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/Monimed.svg'
];

// install Event: Cache the App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// fetch Event: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update the cache with the new version
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
      // Return the cached version immediately if available, else wait for network
      return cachedResponse || fetchPromise;
    })
  );
});

// background sync - handle offline medication logs
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-intake-logs') {
    event.waitUntil(syncIntakeData());
  }
});

async function syncIntakeData() {
  // Logic to pull logs from IndexedDB and POST to the Express /intake-logs endpoint
  console.log('Syncing medication logs to the server...');
}