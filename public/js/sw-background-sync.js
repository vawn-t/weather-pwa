// APP DATA CACHE
const WEATHER_APP_DB = 'WEATHER_APP_DB';
const WEATHER_STORE = 'WEATHER_STORE';
const FORECAST_STORE = 'FORECAST_STORE';

// QUEUE CACHE
const WEATHER_QUEUE_DB = 'WEATHER_QUEUE_DB';
const STORE_NAME = 'WEATHER_QUEUE_STORE';

const WEATHER_SYNC_QUEUE = 'sync-weather-data';
const FORECAST_SYNC_QUEUE = 'sync-forecast-data';

const DB_VERSION = 1;

// Handle message events for service worker communication
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SYNC_WEATHER') {
    console.log('Received SYNC_WEATHER message');
    const requestUrl = event.data.payload.request;

    // Create a new request object to store for later syncing
    const request = new Request(requestUrl, {
      method: 'GET',
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
        const response = await fetch(requestData.url);

        if (response.ok) {
          const body = await response.json();

          const record = {
            id: body.id,
            name: body.name,
            body,
          };

          await storeResponseInIndexedDB(WEATHER_STORE, record);

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
        const response = await fetch(requestData.url);

        if (response.ok) {
          const body = await response.json();
          const record = {
            id: 0,
            name: 'forecastName',
            body,
          };

          await storeResponseInIndexedDB(FORECAST_STORE, record);

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

async function storeResponseInIndexedDB(storeName, record) {
  try {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(WEATHER_APP_DB, 1);

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

        const storeRequest = store.put({ ...record, timestamp: Date.now() });

        storeRequest.onsuccess = () => resolve();
        storeRequest.onerror = () => reject(storeRequest.error);
      };
    });
  } catch (error) {
    console.error('Error storing response in IndexedDB:', error);
  }
}

// Utility functions for managing requests in IndexedDB
async function openDB(dbName, dbVersion) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

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
    const db = await openDB(WEATHER_QUEUE_DB, DB_VERSION);
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
    const requestData = {
      id: `${queueName}-${request.url}`,
      url: request.url,
      method: request.method,
      queueName,
      timestamp: Date.now(),
    };

    const db = await openDB(WEATHER_QUEUE_DB, DB_VERSION);

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
    const db = await openDB(WEATHER_QUEUE_DB, DB_VERSION);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(`${queueName}-${url}`);

      deleteRequest.onsuccess = () => resolve(true);
      deleteRequest.onerror = () => reject(deleteRequest.error);

      console.log('Stored request removed from queue:', `${queueName}-${url}`);
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
