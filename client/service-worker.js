var CACHE_NAME = 'snapdrop-cache-v1.044';
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
  console.log(event.request);
    if (event.request.url.indexOf('/share_target')>-1) {

        event.respondWith(Response.redirect('./#'));

        event.waitUntil(async function() {
            const client = await self.clients.get(event.resultingClientId);
            if(event.request.method === 'POST'){
                const data = await event.request.formData();
                const shareTargetFile = data.get('file');  
                client.postMessage({ shareTargetFile });
            } else {
                const data = (new URL(event.request.url)).searchParams;
                const title = data.get('title');
                const text = data.get('text');
                const url = data.get('url');

                let shareTargetText = title ? title : '';
                shareTargetText += text ? shareTargetText ? ' ' + text : text : '';
                shareTargetText += url ? shareTargetText ? ' ' + url : url : '';

                client.postMessage({ shareTargetText });
            }
        }());
    } else {
        event.respondWith(
            caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }));
    }
});