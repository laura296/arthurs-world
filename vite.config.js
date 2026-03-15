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
      },
      workbox: {
        // Precache only the app shell — JS, CSS, HTML, SVG icons
        globPatterns: ['**/*.{js,css,html,svg,ico,json}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        // Offline: serve index.html for all navigation requests
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/],
        // Runtime caching — assets get cached as the user visits pages
        runtimeCaching: [
          {
            // Images — cache forever, only update when online
            urlPattern: /\.(?:png|webp|jpg|jpeg|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'aw-images',
              expiration: {
                maxEntries: 600,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Audio narration — cache forever
            urlPattern: /\.mp3$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'aw-audio',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Lottie/Rive animations
            urlPattern: /\.(?:lottie|riv)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'aw-animations',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'aw-google-fonts-css',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts font files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'aw-google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Video thumbnails
            urlPattern: /\/videos\/.*\.webp$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'aw-video-thumbs',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
