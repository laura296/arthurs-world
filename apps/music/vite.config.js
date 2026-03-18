import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: '/arthurs-music/',
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
        name: "Arthur's Music",
        short_name: 'Music',
        description: 'Songs, instruments, and music videos for little ones.',
        theme_color: '#8b5cf6',
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
        globPatterns: ['**/*.{js,css,html,webp,svg,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        // Cache videos on first watch (too large for precache)
        runtimeCaching: [
          {
            urlPattern: /\.mp4$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'video-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 30 * 24 * 60 * 60 },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
});
