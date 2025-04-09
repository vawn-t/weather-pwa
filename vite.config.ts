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
				clientsClaim: true
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
