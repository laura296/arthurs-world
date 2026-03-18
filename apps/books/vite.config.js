import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: '/arthurs-books/',
  publicDir: path.resolve(__dirname, '../../public'),
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Arthur's Books",
        short_name: 'Books',
        description: 'Storybooks and fairy tales for little ones.',
        theme_color: '#f59e0b',
        background_color: '#FFF8F0',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: 'icon-maskable.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        // Cache story images & audio on first read (too many to precache)
        runtimeCaching: [
          {
            urlPattern: /\.(png|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'story-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'story-audio',
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
});
