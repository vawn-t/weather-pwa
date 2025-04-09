import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			injectRegister: false,

			pwaAssets: {
				disabled: false,
				config: true
			},

			manifest: {
				name: 'Weather',
				short_name: 'Weather',
				description: 'This is the weather forecast app.',
				icons: [
					{
						src: '/icons/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/icons/maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					},
					{
						src: '/icons/pwa-384x384.png',
						sizes: '384x384',
						type: 'image/png'
					},
					{
						src: '/icons/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/icons/maskable-icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable'
					},
					{
						src: '/icons/apple-touch-icon-180x180.png',
						sizes: '180x180',
						type: 'image/png'
					},
					{
						src: '/icons/pwa-144x144.png',
						sizes: '144x144',
						type: 'image/png'
					},
					{
						src: '/icons/pwa-128x128.png',
						sizes: '128x128',
						type: 'image/png'
					},
					{
						src: '/icons/apple-touch-icon-120x120.png',
						sizes: '120x120',
						type: 'image/png'
					},
					{
						src: '/icons/pwa-96x96.png',
						sizes: '96x96',
						type: 'image/png'
					},
					{
						src: '/icons/pwa-72x72.png',
						sizes: '72x72',
						type: 'image/png'
					},
					{
						src: '/icons/pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png'
					},
					{
						src: '/icons/pwa-48x48.png',
						sizes: '48x48',
						type: 'image/png'
					}
				],
				display: 'standalone',
				orientation: 'portrait',
				lang: 'en',
				scope: '/',
				start_url: '/',
				background_color: '#391A49',
				theme_color: '#391A49'
			},

			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
				skipWaiting: true,

				// Custom runtime caching strategies
				runtimeCaching: [
					{
						// Cache weather API responses (adjust the pattern to match your actual API)
						urlPattern:
							/^(https:\/\/api\.open-meteo\.com\/v1\/forecast|http:\/\/api\.openweathermap\.org\/geo\/1\.0\/direct)$/i,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'weather-api-cache',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 86400 // 24 hours (1 day) stale cache
							},
							cacheableResponse: {
								statuses: [0, 200]
							},
							backgroundSync: {
								name: 'weather-api-queue',
								options: {
									maxRetentionTime: 24 * 60 // Retry for up to 24 hours (in minutes)
								}
							}
						}
					}
					// Finding What data to cache here
					// {
					// 	// Cache app data (modify this pattern as needed)
					// 	urlPattern: /^https?:\/\/.*\/api\/.*$/i,
					// 	handler: 'NetworkFirst',
					// 	options: {
					// 		cacheName: 'app-data-cache',
					// 		expiration: {
					// 			maxEntries: 100,
					// 			maxAgeSeconds: 86400 // 24 hours
					// 		},
					// 		networkTimeoutSeconds: 3, // Fall back to cache if network takes more than 3 seconds
					// 		cacheableResponse: {
					// 			statuses: [0, 200]
					// 		}
					// 	}
					// },
					// Considering caching static assets for both local and external static assets
					// {
					// 	// Cache static assets with a Cache First strategy
					// 	urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|ico)$/i,
					// 	handler: 'CacheFirst',
					// 	options: {
					// 		cacheName: 'static-assets',
					// 		expiration: {
					// 			maxEntries: 100,
					// 			maxAgeSeconds: 604800 // 7 days
					// 		}
					// 	}
					// }
				]
			},

			devOptions: {
				enabled: true,
				navigateFallback: 'index.html',
				suppressWarnings: true,
				type: 'module'
			}
		})
	]
});
