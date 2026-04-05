import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';

// Post-build plugin: append cache-cleanup code to generated sw.js
function swCacheCleanup() {
  let tries = 0;
  function inject() {
    const swPath = path.resolve('dist/sw.js');
    if (fs.existsSync(swPath)) {
      const cleanup = `\n// === Cache cleanup (injected at build) ===\nself.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ns){return Promise.all(ns.filter(function(n){return n!=='images-v3'&&n!=='audio'}).map(function(n){return caches.delete(n)}))}))});\n`;
      fs.appendFileSync(swPath, cleanup);
      console.log('[sw-cache-cleanup] Injected cache cleanup into sw.js');
      return true;
    }
    return false;
  }
  return {
    name: 'sw-cache-cleanup',
    enforce: 'post',
    closeBundle() {
      if (!inject()) {
        // SW might not exist yet, retry after a tick
        setTimeout(() => inject(), 500);
      }
    },
    buildEnd() { inject(); },
  };
}

export default defineConfig({
  base: '/arthurs-world/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Arthur's World",
        short_name: 'ArthursWorld',
        description: 'A magical world of games, stories, and music for little ones.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: 'icon-maskable.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
        shortcuts: [
          {
            name: 'Games',
            short_name: 'Games',
            url: '#/games/all/games',
            icons: [{ src: 'icons/shortcut-games.svg', sizes: '192x192', type: 'image/svg+xml' }],
          },
          {
            name: 'Puzzles',
            short_name: 'Puzzles',
            url: '#/games/all/puzzles',
            icons: [{ src: 'icons/shortcut-puzzles.svg', sizes: '192x192', type: 'image/svg+xml' }],
          },
          {
            name: 'Art',
            short_name: 'Art',
            url: '#/games/all/art',
            icons: [{ src: 'icons/shortcut-art.svg', sizes: '192x192', type: 'image/svg+xml' }],
          },
          {
            name: 'Stories',
            short_name: 'Stories',
            url: '#/games/all/books',
            icons: [{ src: 'icons/shortcut-stories.svg', sizes: '192x192', type: 'image/svg+xml' }],
          },
          {
            name: 'Music',
            short_name: 'Music',
            url: '#/games/all/music',
            icons: [{ src: 'icons/shortcut-music.svg', sizes: '192x192', type: 'image/svg+xml' }],
          },
          {
            name: 'Disney',
            short_name: 'Disney',
            url: '#/games/all/disney',
            icons: [{ src: 'icons/shortcut-disney.svg', sizes: '192x192', type: 'image/svg+xml' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallbackDenylist: [/clear-cache\.html/],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-v3',
              expiration: { maxEntries: 300, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /\.mp3$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio',
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
    swCacheCleanup(),
  ],
});
