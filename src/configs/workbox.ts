import { GenerateSWOptions } from 'workbox-build';

const CACHE_NAMES = {
  WEATHER_API: 'weather-api-cache',
  SEARCH_WEATHER_API: 'search-weather-api-cache',
  STATIC_ASSETS: 'static-assets-cache',
  APP_SHELL: 'app-shell-cache',
  STATIC_RESOURCES: 'static-resources-cache',
};

const A_MONTH = 2592000;
const A_DAY = 86400;

export const workboxConfig: Partial<GenerateSWOptions> = {
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
      urlPattern: /^https:\/\/api\.open-meteo\.org\.geo\/1.0\/direct$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: CACHE_NAMES.WEATHER_API,
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
      // Cache search weather API responses
      urlPattern: 'https://api.openweathermap.org/geo/1.0/direct',
      handler: 'NetworkFirst',
      options: {
        cacheName: CACHE_NAMES.SEARCH_WEATHER_API,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: A_DAY,
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
        cacheName: CACHE_NAMES.STATIC_ASSETS,
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
        cacheName: CACHE_NAMES.APP_SHELL,
        expiration: {
          maxAgeSeconds: A_DAY, // 24 hours
        },
        cacheableResponse: {},
      },
    },

    {
      // Cache CSS/JS with a network-first strategy
      urlPattern: /\.(?:js|css)$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: CACHE_NAMES.STATIC_RESOURCES,
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

  importScripts: ['js/sw-notifications.js', 'js/sw-background-sync.js'],
};
