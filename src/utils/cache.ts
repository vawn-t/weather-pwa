// This utility helps with cache busting and version management
import { CACHE_VERSION } from '@constants';

// Generate a timestamp-based cache buster for dynamic resources
export const generateCacheBuster = () => {
  return `v=${CACHE_VERSION}`;
};

// Add cache busting parameter to URLs
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${generateCacheBuster()}`;
};

// Force service worker update
export const updateServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return true;
      }
    } catch (error) {
      console.error('Failed to update service worker:', error);
    }
  }
  return false;
};

// Clear all application caches
export const clearAllCaches = async (): Promise<boolean> => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      return true;
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  }
  return false;
};

// Update application with forced reload
export const forceAppUpdate = async (): Promise<void> => {
  await clearAllCaches();
  await updateServiceWorker();
  window.location.reload();
};
