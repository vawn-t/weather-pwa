import type { ManifestOptions } from 'vite-plugin-pwa';

export const manifestConfig: Partial<ManifestOptions> = {
  name: 'Weather',
  short_name: 'Weather',
  description: 'This is the weather forecast app.',
  screenshots: [
    {
      src: 'screenshots/screenshot-1.png',
      sizes: '1290x2796',
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
