import { OpenWeatherMap } from '@models';

const DB_NAME = 'weatherApp';
const DB_VERSION = 1;
const LOCATIONS_STORE = 'locations';

// Private variable to store the database connection
let db: IDBDatabase | null = null;

// Initialize the database
const initDB = async (): Promise<IDBDatabase> => {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Failed to open IndexedDB');
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create locations object store if it doesn't exist
      if (!database.objectStoreNames.contains(LOCATIONS_STORE)) {
        // Create store with city name as key path and add indexes for quick lookups
        const objectStore = database.createObjectStore(LOCATIONS_STORE, {
          keyPath: 'id',
        });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

const addLocation = async (location: OpenWeatherMap): Promise<void> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([LOCATIONS_STORE], 'readwrite');
    const store = transaction.objectStore(LOCATIONS_STORE);

    // Create a record with a unique ID (using city ID from OpenWeatherMap)
    const record = {
      id: location.id,
      name: location.name,
      data: location,
      timestamp: Date.now(),
    };

    const request = store.put(record);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event);
  });
};

const getLocations = async (): Promise<
  { id: string; name: string; data: OpenWeatherMap; timestamp: number }[]
> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([LOCATIONS_STORE], 'readonly');
    const store = transaction.objectStore(LOCATIONS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event);
  });
};

// Delete a location by ID
const deleteLocation = async (locationId: number): Promise<void> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([LOCATIONS_STORE], 'readwrite');
    const store = transaction.objectStore(LOCATIONS_STORE);
    const request = store.delete(locationId);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event);
  });
};

export const indexedDBService = {
  initDB,
  addLocation,
  getLocations,
  deleteLocation,
};
