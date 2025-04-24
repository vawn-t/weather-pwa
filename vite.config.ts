import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import tailwindcss from '@tailwindcss/vite';
import { MANIFEST_CONFIG, WORKBOX_CONFIG } from './src/configs';

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

      manifest: MANIFEST_CONFIG,

      workbox: WORKBOX_CONFIG,

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
