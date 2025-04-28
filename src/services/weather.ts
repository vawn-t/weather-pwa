import { SYNC_KEY, API_ROUTES, CACHE_KEY } from '@constants';
import { OpenWeatherMap, OpenWeatherMapForecast } from '@models';

/**
 * Get weather for a specific location by coordinates using OpenWeatherMap API
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @param units - Units of measurement ('standard', 'metric', or 'imperial')
 * @returns Promise with OpenWeatherMap weather data
 */
export const getOpenWeatherMapByCoordinates = async (
  lat: number,
  lon: number,
  units: 'standard' | 'metric' | 'imperial' = 'metric'
): Promise<OpenWeatherMap> => {
  const url = API_ROUTES.WEATHER_BY_COORDINATES(lat, lon, units);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error fetching OpenWeatherMap data: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getOpenWeatherMapByCoordinates:', error);

    // Register for background sync if available and we're offline
    if (!navigator.onLine && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;

        // Check if sync is supported
        if ('sync' in registration) {
          // Create a new request to be synced later
          const request = new Request(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
          });

          if (registration.active && registration.active.postMessage) {
            registration.active.postMessage({
              type: 'SYNC_WEATHER',
              payload: { request: request.url },
            });
          }

          // Register for background sync
          await registration.sync.register(SYNC_KEY.WEATHER_SYNC_QUEUE);
          console.log('Registered for weather sync');
        } else {
          console.log('Background Sync not supported');
        }

        // Try to return cached data
        const cache = await caches.open(CACHE_KEY.WEATHER_CACHE);
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
          console.log('Returned cached weather data');
          return cachedResponse.json();
        }
      } catch (syncError) {
        console.error('Failed to register for sync:', syncError);
      }
    }

    // Re-throw original error if we couldn't recover
    throw error;
  }
};

/**
 * Get weather forecast for a specific location by coordinates using OpenWeatherMap API
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @param units - Units of measurement ('standard', 'metric', or 'imperial')
 * @returns Promise with OpenWeatherMap forecast data
 */
export const getForecastByCoordinates = async (
  lat: number,
  lon: number,
  units: 'standard' | 'metric' | 'imperial' = 'metric'
): Promise<OpenWeatherMapForecast> => {
  const url = API_ROUTES.FORECAST_BY_COORDINATES(lat, lon, units);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error fetching OpenWeatherMap forecast: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    // Register for background sync if available and we're offline
    if (!navigator.onLine && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;

        // Check if sync is supported
        if ('sync' in registration) {
          console.log('Background Sync supported');

          // Create a new request to be synced later
          const request = new Request(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          // Use our background sync function in the service worker
          if (registration.active && registration.active.postMessage) {
            registration.active.postMessage({
              type: 'SYNC_FORECAST',
              payload: { request: request.url },
            });
          }

          // Register for background sync
          await registration.sync.register(SYNC_KEY.FORECAST_SYNC_QUEUE);
          console.log('Registered for forecast sync');
        } else {
          console.log('Background Sync not supported');
        }

        // Try to return cached data
        const cache = await caches.open(SYNC_KEY.FORECAST_SYNC_QUEUE);
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
          console.log('Returned cached forecast data');
          return cachedResponse.json();
        }
      } catch (syncError) {
        console.error('Failed to register for sync:', syncError);
      }
    }

    // Re-throw original error if we couldn't recover
    throw error;
  }
};
