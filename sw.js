
const CACHE_NAME = 'amar-khata-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap'
];

// ইনস্টল করার সময় সব ফাইল সেভ করে রাখবে
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// অফলাইনে থাকার সময় ক্যাশ থেকে ফাইল দিবে
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // নতুন রিসোর্স আসলে ক্যাশে জমা করবে (যাতে লাইব্রেরিগুলো কাজ করে)
          if (event.request.url.includes('esm.sh') || event.request.url.includes('dicebear')) {
            cache.put(event.request, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
        // যদি নেট না থাকে এবং ক্যাশেও না থাকে
        if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
        }
    })
  );
});