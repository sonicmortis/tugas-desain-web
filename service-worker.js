const CACHE_NAME = 'tugas-web-v1';
const urlsToCache = [
  '/', // Meng-cache halaman utama
  'index.html',
  'desain.css',
  'about.html',
  'contact.html',
  'offline.html',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
];

// menginstal Service Worker dan meng-cache semua aset statis
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event: Fetch
// Melayani aset dari cache saat offline atau jaringan jika tersedia
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - mengembalikan response dari cache
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, lakukan fetch dari jaringan
        return fetch(event.request);
      })
  );
});

// Event: Activate
// Membersihkan cache lama jika ada versi baru
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});