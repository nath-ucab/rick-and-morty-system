const CACHE_NAME = 'rickmorty-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/auth.js',
    '/js/characters.js',
    '/js/episodes.js',
    '/js/app.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache abierto');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    const request = event.request;
    const url = new URL(request.url);
    
    if (request.method !== 'GET') {
        event.respondWith(fetch(request));
        return;
    }

    if (url.hostname.includes('rickandmortyapi.com')) {
        event.respondWith(
            fetch(request)
                .then(function(response) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(request, responseToCache);
                        });
                    return response;
                })
                .catch(function() {
                    return caches.match(request);
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(function(cachedResponse) {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request)
                    .then(function(response) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});