import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

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
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-v2',
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
  ],
});
