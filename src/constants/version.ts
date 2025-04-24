/**
 * Application Version Management
 * ------------------------------
 * This file contains version information used throughout the application
 * for cache busting and ensuring users always get the latest content.
 *
 * How to use:
 * 1. Change APP_VERSION when making significant application changes
 *    - Follow semantic versioning: MAJOR.MINOR.PATCH
 *    - MAJOR: incompatible API changes
 *    - MINOR: add functionality in a backward compatible manner
 *    - PATCH: backward compatible bug fixes
 *
 * 2. The cache keys will update automatically based on:
 *    - The APP_VERSION
 *    - The current day (via CACHE_VERSION)
 *
 * 3. Import these constants where needed:
 *    - Service API calls should use addCacheBuster() from @utils/cache
 *    - IndexedDB uses versioned database names
 *    - Service Worker triggers cache clearing on version changes
 */

// App version - update this when making significant changes
export const APP_VERSION = '1.0.0';

// Cache version includes date component for daily refreshes
export const CACHE_VERSION = `${APP_VERSION}-${Math.floor(Date.now() / (1000 * 60 * 60 * 24))}`;
export const BUILD_DATE = new Date().toISOString();

// Generate a unique cache key based on the version and date
export const getCacheKey = (prefix: string) => `${prefix}-${CACHE_VERSION}`;
