import { openDB, DBSchema } from 'idb';
import { APP_VERSION } from '@constants';

// Define your schema
interface WeatherAppDB extends DBSchema {
  locations: {
    key: string;
    value: unknown;
    indexes: { 'by-name': string };
  };
  weather: {
    key: string;
    value: unknown;
  };
  forecast: {
    key: string;
    value: unknown;
  };
}

// Version the database with app version
const DB_VERSION = parseInt(APP_VERSION.split('.').join(''));

// Create versioned database name
const DB_NAME = `weather-app-${APP_VERSION}`;

// // Create and open the database
// export const weatherDB = () => {
//   return openDB<WeatherAppDB>(DB_NAME, dbVersion, {
//     upgrade(db) {
//       // Create object stores if they don't exist
//       if (!db.objectStoreNames.contains('locations')) {
//         const locationStore = db.createObjectStore('locations', {
//           keyPath: 'id',
//         });
//         locationStore.createIndex('by-name', 'name');
//       }

//       if (!db.objectStoreNames.contains('weather')) {
//         db.createObjectStore('weather', { keyPath: 'locationId' });
//       }

//       if (!db.objectStoreNames.contains('forecast')) {
//         db.createObjectStore('forecast', { keyPath: 'locationId' });
//       }
//     },
//   });
// };

// // Helper to migrate data from old versions if needed
// export const migrateData = async () => {
//   try {
//     // List all databases
//     const dbList = await indexedDB.databases();

//     // Find old versions (excluding current version)
//     const oldDbs = dbList.filter(
//       (db) => db.name?.startsWith('weather-app-') && db.name !== DB_NAME
//     );

//     if (oldDbs.length > 0) {
//       console.log('Found older database versions, migrating data...');

//       // Here you would implement your migration logic
//       // For example, open the old DB, read its data, and write to the new DB

//       // Then delete old databases
//       for (const oldDb of oldDbs) {
//         if (oldDb.name) {
//           await indexedDB.deleteDatabase(oldDb.name);
//           console.log(`Deleted old database: ${oldDb.name}`);
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Failed to migrate IndexedDB data:', error);
//   }
// };

// // Initialize database and run migration if needed
// export const initializeDatabase = async () => {
//   await weatherDB();
//   await migrateData();
//   return true;
// };

import { FORECAST_STORE, LOCATIONS_STORE, WEATHER_STORE } from '@constants';

let db: IDBDatabase | null = null;

export interface StoredItem<T> {
  id: number;
  name: string;
  data: T;
  timestamp: number;
}

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
      }

      if (!database.objectStoreNames.contains(WEATHER_STORE)) {
        // Create weather object store if it doesn't exist
        const objectStore = database.createObjectStore(WEATHER_STORE, {
          keyPath: 'id',
        });
        objectStore.createIndex('name', 'name', { unique: false });
      }

      if (!database.objectStoreNames.contains(FORECAST_STORE)) {
        // Create weather object store if it doesn't exist
        const objectStore = database.createObjectStore(FORECAST_STORE, {
          keyPath: 'id',
        });
        objectStore.createIndex('name', 'name', { unique: false });
      }
    };
  });
};

const addItem = async <T>(
  storeName: string,
  item: T,
  id: number,
  name: string
): Promise<void> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    const record = {
      id,
      name,
      data: item,
      timestamp: Date.now(),
    };

    const request = store.put(record);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event);
  });
};

const getItems = async <T>(storeName: string): Promise<StoredItem<T>[]> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event);
  });
};

const deleteItem = async (storeName: string, itemId: number): Promise<void> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(itemId);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event);
  });
};

export { addItem, getItems, deleteItem };
