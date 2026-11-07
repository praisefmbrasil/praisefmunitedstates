// Necessário para o injectManifest funcionar — o Workbox substitui
// isso pela lista de assets do build automaticamente durante o build.
// eslint-disable-next-line no-undef
self.__WB_MANIFEST;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // não tocar no stream — deixa o navegador lidar direto com a
  // conexão de áudio, sem o Service Worker interceptar/cachear.
  if (
    url.includes("zeno.fm") ||
    url.includes("stream") ||
    url.endsWith(".mp3")
  ) {
    return;
  }

  event.respondWith(fetch(event.request));
});