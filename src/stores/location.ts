import { LOCATIONS_STORE } from '@constants';
import { OpenWeatherMap } from '@models';
import {
  addItem,
  clearStore,
  deleteItem,
  getItems,
  StoredItem,
} from './indexedDB';

const addLocation = async (
  location: OpenWeatherMap,
  index?: number
): Promise<void> => {
  const dateAdded = index || Date.now();

  return addItem(
    LOCATIONS_STORE,
    { ...location, dateAdded },
    dateAdded,
    location.name
  );
};

const getLocations = async (): Promise<StoredItem<OpenWeatherMap>[]> => {
  return getItems<OpenWeatherMap>(LOCATIONS_STORE);
};

const deleteLocation = async (locationId: number): Promise<void> => {
  return deleteItem(LOCATIONS_STORE, locationId);
};

// Update the order of locations after dragging
const updateLocationOrder = async (
  locations: OpenWeatherMap[]
): Promise<void> => {
  try {
    // Since IndexedDB doesn't naturally support ordering, we'll update each location
    // The new order will be maintained when we retrieve them due to how we're re-adding them

    await clearStore(LOCATIONS_STORE);

    locations.forEach(async (location, index) => {
      await addLocation(location, ++index);
    });
  } catch (error) {
    console.error('Error updating location order:', error);
    throw error;
  }
};

export { addLocation, getLocations, deleteLocation, updateLocationOrder };
