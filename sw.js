// Minimal service worker so Chrome can install the app. Always uses the network (no stale cache).
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){ e.respondWith(fetch(e.request)); });
