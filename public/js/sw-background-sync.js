// Background Sync for Weather APIs
const WEATHER_SYNC_QUEUE = 'sync-weather-data';
const FORECAST_SYNC_QUEUE = 'sync-forecast-data';
const WEATHER_CACHE = 'weather-api-cache';
const FORECAST_CACHE = 'forecast-api-cache';

// Handle message events for service worker communication
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SYNC_WEATHER') {
    console.log('Received SYNC_WEATHER message');
    const requestUrl = event.data.payload.request;

    // Create a new request object to store for later syncing
    const request = new Request(requestUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    // Store the request for later processing
    storeRequest(WEATHER_SYNC_QUEUE, request)
      .then(() => console.log('Weather request stored for sync'))
      .catch((error) => console.error('Error storing weather request:', error));
  }

  if (event.data && event.data.type === 'SYNC_FORECAST') {
    console.log('Received SYNC_FORECAST message');
    const requestUrl = event.data.payload.request;

    // Create a new request object to store for later syncing
    const request = new Request(requestUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    // Store the request for later processing
    storeRequest(FORECAST_SYNC_QUEUE, request)
      .then(() => console.log('Forecast request stored for sync'))
      .catch((error) =>
        console.error('Error storing forecast request:', error)
      );
  }
});

// Handle background sync events
self.addEventListener('sync', (event) => {
  console.log(`Background sync event triggered: ${event.tag}`);

  if (event.tag === WEATHER_SYNC_QUEUE) {
    event.waitUntil(syncWeatherData());
  } else if (event.tag === FORECAST_SYNC_QUEUE) {
    event.waitUntil(syncForecastData());
  }
});

// Process failed weather data requests
async function syncWeatherData() {
  try {
    // Get all stored requests from IndexedDB
    const requests = await getStoredRequests(WEATHER_SYNC_QUEUE);

    // Process each failed request
    const promises = requests.map(async (request) => {
      try {
        const response = await fetch(request.clone());

        if (response.ok) {
          // If success, cache the response
          const cache = await caches.open(WEATHER_CACHE);
          await cache.put(request, response.clone());

          // Optionally notify the user
          await showWeatherUpdatedNotification();

          // Remove from queue
          await removeStoredRequest(WEATHER_SYNC_QUEUE, request.url);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error syncing weather data:', error);
        return false;
      }
    });

    return Promise.all(promises);
  } catch (error) {
    console.error('Error in syncWeatherData:', error);
  }
}

// Process failed forecast data requests
async function syncForecastData() {
  try {
    // Get all stored requests from IndexedDB
    const requests = await getStoredRequests(FORECAST_SYNC_QUEUE);

    // Process each failed request
    const promises = requests.map(async (request) => {
      try {
        const response = await fetch(request.clone());

        if (response.ok) {
          // If success, cache the response
          const cache = await caches.open(FORECAST_CACHE);
          await cache.put(request, response.clone());

          // Remove from queue
          await removeStoredRequest(FORECAST_SYNC_QUEUE, request.url);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error syncing forecast data:', error);
        return false;
      }
    });

    return Promise.all(promises);
  } catch (error) {
    console.error('Error in syncForecastData:', error);
  }
}

// Utility functions for managing requests in IndexedDB
async function getStoredRequests(queueName) {
  // This is a simple implementation - in a real app, you'd use IndexedDB properly
  // For now we'll use the cache as a temporary storage
  try {
    const cache = await caches.open(`${queueName}-requests`);
    const keys = await cache.keys();
    return keys;
  } catch (error) {
    console.error('Error getting stored requests:', error);
    return [];
  }
}

async function storeRequest(queueName, request) {
  try {
    const cache = await caches.open(`${queueName}-requests`);
    // Store the request with a cloned empty response as a placeholder
    await cache.put(request.clone(), new Response(''));
    return true;
  } catch (error) {
    console.error('Error storing request:', error);
    return false;
  }
}

async function removeStoredRequest(queueName, requestUrl) {
  try {
    const cache = await caches.open(`${queueName}-requests`);
    return cache.delete(requestUrl);
  } catch (error) {
    console.error('Error removing stored request:', error);
    return false;
  }
}

// Show a notification when weather data is updated
async function showWeatherUpdatedNotification() {
  try {
    return self.registration.showNotification('Weather Updated', {
      body: 'Your weather data has been updated with the latest information.',
      icon: 'pwa-192x192.png',
      badge: 'pwa-64x64.png',
      tag: 'weather-update',
      data: {
        dateOfUpdate: Date.now(),
        type: 'weather-sync',
      },
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

// Make functions available to the service worker
self.syncWeatherQueue = storeRequest.bind(null, WEATHER_SYNC_QUEUE);
self.syncForecastQueue = storeRequest.bind(null, FORECAST_SYNC_QUEUE);
