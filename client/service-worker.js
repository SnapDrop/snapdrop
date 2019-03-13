<<<<<<< Updated upstream
=======
var CACHE_NAME = 'snapdrop-cache-v1.042';
var urlsToCache = [
    '/',
    '/styles.css',
    '/scripts/network.js',
    '/scripts/ui.js',
    '/sounds/blop.mp3',
    '/images/favicon-96x96.png'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'POST') return;

    event.respondWith(Response.redirect('./'));

    event.waitUntil(async function() {
        const data = await event.request.formData();
        const client = await self.clients.get(event.resultingClientId);
        const shareTargetFile = data.get('file');

        const title = data.get('title');
        const text = data.get('text');
        const url = data.get('url');

        let shareTargetText = title ? title : '';
        shareTargetText += text ? shareTargetText ? ' ' + text : text : '';
        shareTargetText += url ? shareTargetText ? ' ' + url : url : '';
        if (!shareTargetText) return;
        history.pushState({}, 'URL Rewrite', '/');

        console.log('Shared Target Text:', '"' + shareTargetText + '"');


        client.postMessage({ shareTargetFile, shareTargetText });
    }());
});
>>>>>>> Stashed changes
