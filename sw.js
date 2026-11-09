// Service worker of the GSH Maintenance wrapper page.
// 1) lets Chrome install the app (always uses the network, no stale cache)
// 2) shows push notifications (Firebase Cloud Messaging) when the app is closed, and opens the machine / request on tap
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){ e.respondWith(fetch(e.request)); });

self.addEventListener('push', function(e){
  var d = {};
  try { var j = e.data.json(); d = j.data || j.notification || j || {}; }
  catch (x) { try { d = {body: e.data.text()}; } catch (y) { d = {}; } }
  var opt = {
    body: String(d.body || ''), icon: 'icon-192-v2.png', badge: 'badge-96.png', dir: 'rtl', lang: 'ar',
    data: {url: String(d.url || './')}, vibrate: [200, 100, 200, 100, 400], requireInteraction: d.urgent === '1'
  };
  if (d.tag) { opt.tag = String(d.tag); opt.renotify = true; }
  // every push must show a notification (iPhone cancels the subscription otherwise)
  e.waitUntil(self.registration.showNotification(String(d.title || 'GSH Maintenance'), opt));
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var scope = self.registration.scope, url = scope;
  try { var u = new URL((e.notification.data && e.notification.data.url) || './', scope).href; if (u.indexOf(scope) === 0) url = u; } catch (x) {}
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(list){
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf(scope) === 0 && 'focus' in c) { c.postMessage({gshOpen: url}); return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
