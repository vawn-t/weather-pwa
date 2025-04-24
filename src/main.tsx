import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { registerSW } from 'virtual:pwa-register';

import App from './App.tsx';
import { APP_VERSION, CACHE_VERSION } from '@constants';

import './index.css';

// Setup PWA auto update functionality with cache busting
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New version available. Reload to update?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App is ready for offline use');
  },
  onRegisteredSW(swUrl: string) {
    console.log(`Service Worker registered: ${swUrl}`);
    console.log(`App version: ${APP_VERSION}, Cache version: ${CACHE_VERSION}`);
  },
  // Add cache busting parameter to SW registration
  immediate: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
