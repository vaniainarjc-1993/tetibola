// Tetibola : fonctionne hors connexion et charge toujours la dernière version quand internet est disponible.
const CACHE = "tetibola-v2";
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"])).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; }).catch(() => caches.match(req).then(r => r || caches.match("./"))));
});
