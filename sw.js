/* Sula Products — lets the site install as a phone app and open fast.
   Pages and product data always try the internet first, so prices are
   never stale; the saved copy is only used when there is no connection.
   Change VERSION when you want every phone to drop its saved copy. */
var VERSION = "sula-v1";
var CORE = [
  "./", "index.html", "products.html", "product.html", "cart.html",
  "assets/css/styles.css",
  "assets/js/i18n.js", "assets/js/common.js", "assets/js/home.js",
  "assets/js/catalog.js", "assets/js/product.js", "assets/js/cart.js",
  "data/products.json", "data/settings.json",
  "images/app/icon-192.png", "images/site/no-image.svg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(VERSION).then(function (cache) { return cache.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function save(request, response) {
  if (response && response.ok && response.type === "basic") {
    var copy = response.clone();
    caches.open(VERSION).then(function (cache) { cache.put(request, copy); });
  }
  return response;
}

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  var url = new URL(request.url);
  if (url.origin !== location.origin) return; // fonts, WhatsApp and Instagram links go straight to the internet

  var fresh = request.mode === "navigate" || url.pathname.indexOf("/data/") !== -1 || /\.(html|js|css)$/.test(url.pathname);
  if (fresh) {
    // Internet first, saved copy when offline
    event.respondWith(fetch(request).then(function (r) { return save(request, r); }).catch(function () {
      return caches.match(request, { ignoreSearch: true }).then(function (hit) { return hit || caches.match("index.html"); });
    }));
  } else {
    // Photos and icons: saved copy first (fast), refreshed in the background
    event.respondWith(caches.match(request).then(function (hit) {
      var network = fetch(request).then(function (r) { return save(request, r); });
      return hit || network;
    }));
  }
});
