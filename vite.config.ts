import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import tailwindcss from '@tailwindcss/vite';

const A_MONTH = 2592000;
const A_DAY = 86400;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      // Add a unique revision to each file
      useCredentials: true,

      // Increase frequency of SW updates check
      injectRegister: 'script',

      includeAssets: ['**/*'],

      manifest: {
        name: 'Weather',
        short_name: 'Weather',
        description: 'This is the weather forecast app.',
        screenshots: [
          {
            src: 'screenshots/screenshot-1.png',
            sizes: '1080x2340',
            type: 'image/webp',
            platform: 'ios',
            label: 'Weather forecast for the week',
          },
          {
            src: 'screenshots/screenshot-2.webp',
            sizes: '1542x1294',
            type: 'image/webp',
            form_factor: 'wide',
            label: 'Weather forecast for the week',
          },
        ],
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],

        display: 'standalone',
        orientation: 'portrait',
        lang: 'en',
        scope: '/',
        start_url: '/',
        background_color: '#391A49',
        theme_color: '#391A49',
      },

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,png,jpg,jpeg,svg,woff2,woff,eot,ttf,ico}',
        ],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        // Add cache name with version
        cacheId: 'weather-pwa-cache',

        // Don't cache based on response headers
        ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^v=/],

        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB

        // Custom runtime caching strategies
        runtimeCaching: [
          {
            // Cache weather API responses (adjust the pattern to match your actual API)
            urlPattern:
              /^(https:\/\/api\.open-meteo\.com\/v1\/forecast|http:\/\/api\.openweathermap\.org\/geo\/1\.0\/direct)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: A_DAY, // 24 hours stale cache
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            // Cache static assets with a Cache First strategy
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: A_MONTH, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            // Cache app shell files
            urlPattern: /\/(index\.html)?$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-shell-cache',
              expiration: {
                maxAgeSeconds: A_DAY, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            // Cache CSS/JS with a network-first strategy
            urlPattern: /\.(?:js|css)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'static-resources-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: A_DAY, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],

        importScripts: ['js/sw-notifications.js'],
      },

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
      },
    }),
  ],

  resolve: {
    alias: {
      '@screens': path.resolve(__dirname, './src/screens'),
      '@components': path.resolve(__dirname, './src/components'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@models': path.resolve(__dirname, './src/models'),
      '@services': path.resolve(__dirname, './src/services'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },

  // Add build configuration for cache busting
  build: {
    rollupOptions: {
      output: {
        // Use content hash for cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    // Generate manifest file for asset mapping
    manifest: true,
  },
});
