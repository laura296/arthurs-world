// Custom service worker code injected before workbox.
// Nuke ALL old caches on activate to clear poisoned image 404s.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((n) => n !== 'images-v3' && n !== 'audio')
          .map((n) => {
            console.log('[sw] Deleting old cache:', n);
            return caches.delete(n);
          })
      );
    })
  );
});
