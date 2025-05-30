import {
  WEATHER_APP_DB,
  DB_VERSION,
  FORECAST_STORE,
  LOCATIONS_STORE,
  WEATHER_STORE,
} from '@constants';

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
    const request = indexedDB.open(WEATHER_APP_DB, DB_VERSION);

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

const clearStore = async (storeName: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event);
  });
};

export { addItem, getItems, deleteItem, clearStore };
