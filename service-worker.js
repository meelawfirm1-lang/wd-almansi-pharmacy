const CACHE_NAME = 'wad-almansi-cache-v1';
const urlsToCache = [
    './', 
    // الملفات التي يجب تخزينها مؤقتاً ليعمل التطبيق Off-line
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js',
    'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    '/icons/icon-72x72.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// تثبيت (Install) - تخزين الموارد مؤقتاً
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('PWA: Opened cache');
        return cache.addAll(urlsToCache).catch(err => {
            console.error('PWA: Cache add failed for some resources:', err);
        });
      })
  );
});

// جلب (Fetch) - تقديم الموارد من الكاش أولاً
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // العودة بالكاش أولاً (Cache-first strategy)
        if (response) {
          return response;
        }
        // إذا لم توجد، اذهب إلى الشبكة
        return fetch(event.request);
      })
  );
});

// تفعيل (Activate) - حذف الكاشات القديمة
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('PWA: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
