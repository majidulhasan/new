
const CACHE_NAME = 'amar-khata-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap'
];

// ইনস্টল করার সময় বেসিক ফাইলগুলো ক্যাশ করবে
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ক্যাশ কন্ট্রোল করার জন্য অ্যাক্টিভেশন
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// মেইন অফলাইন লজিক: ক্যাশ থেকে ফাইল দিবে, না থাকলে নেট থেকে এনে ক্যাশ করবে
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // নতুন যেকোনো ফাইল (যেমন: esm.sh থেকে আসা লাইব্রেরি) ক্যাশে জমা করবে
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic' || event.request.url.includes('esm.sh')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // যদি ইন্টারনেট না থাকে এবং ক্যাশেও না থাকে, তাহলে index.html দিবে
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
