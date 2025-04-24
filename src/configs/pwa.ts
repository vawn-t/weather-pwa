import type { ManifestOptions } from 'vite-plugin-pwa';
// import type { GenerateSWOptions } from 'vite-plugin-pwa';
import type { GenerateSWOptions } from 'node_modules/.pnpm/workbox-build@7.3.0_@types+babel__core@7.20.5/node_modules/workbox-build/build/types.d.ts';

const A_MONTH = 2592000;
const A_DAY = 86400;

export const MANIFEST_CONFIG: Partial<ManifestOptions> = {
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
};

export const WORKBOX_CONFIG: Partial<GenerateSWOptions> = {
  globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,woff2,woff,eot,ttf,ico}'],
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
};
