/* coi-serviceworker v0.1.7 - github.com/gzuidhof/coi-serviceworker */
/* Enables SharedArrayBuffer on GitHub Pages by patching COOP/COEP headers */
(() => {
  if (typeof window === 'undefined') {
    // Service worker scope
    self.addEventListener('install', () => self.skipWaiting());
    self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
    self.addEventListener('fetch', (e) => {
      if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;
      e.respondWith(
        fetch(e.request).then((r) => {
          if (r.status === 0) return r;
          const h = new Headers(r.headers);
          h.set('Cross-Origin-Opener-Policy', 'same-origin');
          h.set('Cross-Origin-Embedder-Policy', 'require-corp');
          h.set('Cross-Origin-Resource-Policy', 'cross-origin');
          return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
        })
      );
    });
  } else {
    // Page scope — register the service worker
    if (!window.crossOriginIsolated) {
      navigator.serviceWorker.register(window.coi_sw_url || '/coi-serviceworker.js').then((reg) => {
        reg.addEventListener('updatefound', () => {
          if (reg.installing) {
            reg.installing.addEventListener('statechange', (e) => {
              if (e.target.state === 'installed') location.reload();
            });
          }
        });
        if (reg.active && !navigator.serviceWorker.controller) location.reload();
      }).catch(() => {});
    }
  }
})();
