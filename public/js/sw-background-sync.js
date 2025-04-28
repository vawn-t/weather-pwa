const WEATHER_QUEUE_DB = 'WEATHER_QUEUE_DB';
const STORE_NAME = 'WEATHER_QUEUE_STORE';

const WEATHER_APP_DB = 'WEATHER_APP_DB';
const DB_VERSION = 1;

const WEATHER_SYNC_QUEUE = 'sync-weather-data';
const FORECAST_SYNC_QUEUE = 'sync-forecast-data';
const WEATHER_CACHE = 'weather-api-cache';
const FORECAST_CACHE = 'forecast-api-cache';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// Handle message events for service worker communication
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SYNC_WEATHER') {
    console.log('Received SYNC_WEATHER message');
    const requestUrl = event.data.payload.request;

    // Create a new request object to store for later syncing
    const request = new Request(requestUrl, {
      method: 'GET',
      headers,
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
      headers,
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
    const promises = requests.map(async (requestData) => {
      try {
        // Recreate the request from stored data
        const request = new Request(requestData.url, {
          method: requestData.method,
          headers: new Headers(requestData.headers),
        });

        const response = await fetch(request);

        if (response.ok) {
          // If success, cache the response
          const cache = await caches.open(WEATHER_CACHE);
          await cache.put(request, response.clone());

          // Store in IndexedDB for app access
          const data = await response.clone().json();
          await storeResponseInIndexedDB(WEATHER_CACHE, requestData.url, data);

          // Optionally notify the user
          await showWeatherUpdatedNotification();

          // Remove from queue
          await removeStoredRequest(WEATHER_SYNC_QUEUE, requestData.url);
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
    const promises = requests.map(async (requestData) => {
      try {
        // Recreate the request from stored data
        const request = new Request(requestData.url, {
          method: requestData.method,
          headers: new Headers(requestData.headers),
        });

        const response = await fetch(request);

        if (response.ok) {
          // If success, cache the response
          const cache = await caches.open(FORECAST_CACHE);
          await cache.put(request, response.clone());

          // Store in IndexedDB for app access
          const data = await response.clone().json();
          await storeResponseInIndexedDB(FORECAST_CACHE, requestData.url, data);

          // Remove from queue
          await removeStoredRequest(FORECAST_SYNC_QUEUE, requestData.url);
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

// Utility function to store API responses in IndexedDB
async function storeResponseInIndexedDB(storeName, url, data) {
  try {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(WEATHER_QUEUE_DB, 1);

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'url' });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        const storeRequest = store.put({
          url,
          data,
          timestamp: Date.now(),
        });

        storeRequest.onsuccess = () => resolve();
        storeRequest.onerror = () => reject(storeRequest.error);
      };
    });
  } catch (error) {
    console.error('Error storing response in IndexedDB:', error);
  }
}

// Utility functions for managing requests in IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(WEATHER_QUEUE_DB, 1);

    request.onerror = () => reject(request.error);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('queueName', 'queueName', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
  });
}

async function getStoredRequests(queueName) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('queueName');
      const getRequest = index.getAll(queueName);

      getRequest.onsuccess = () => resolve(getRequest.result || []);
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (error) {
    console.error('Error getting stored requests:', error);
    return [];
  }
}

async function storeRequest(queueName, request) {
  try {
    // Extract headers as an array of name-value pairs
    const headers = [];
    request.headers.forEach((value, name) => {
      headers.push([name, value]);
    });

    const requestData = {
      id: `${queueName}-${request.url}`,
      url: request.url,
      method: request.method,
      headers,
      queueName,
      timestamp: Date.now(),
    };

    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const putRequest = store.put(requestData);

      putRequest.onsuccess = () => resolve(true);
      putRequest.onerror = () => reject(putRequest.error);
    });
  } catch (error) {
    console.error('Error storing request:', error);
    return false;
  }
}

async function removeStoredRequest(queueName, url) {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(`${queueName}-${url}`);

      deleteRequest.onsuccess = () => resolve(true);
      deleteRequest.onerror = () => reject(deleteRequest.error);
    });
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
