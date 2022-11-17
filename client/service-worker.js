var CACHE_NAME = 'snapdrop-cache-v2';
var urlsToCache = [
    './',
    'index.html',
    'styles.css',
    'scripts/network.js',
    'scripts/ui.js',
    'scripts/clipboard.js',
    'scripts/theme.js',
    'sounds/blop.mp3',
    'images/favicon-96x96.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
            console.log('[Service Worker] Caching files');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(res) {
            return res || fetch(event.request).then(function(response) {
                return caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(caches.keys().then(function(cacheNames) {
        return Promise.all(cacheNames.map(function(key) {
            if(CACHE_NAME.indexOf(key) === -1) {
                return caches.delete(key);
            }
        }));
    }));
});
