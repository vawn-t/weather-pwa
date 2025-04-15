import { LOCATIONS_STORE } from '@constants';
import { OpenWeatherMap } from '@models';
import { addItem, deleteItem, getItems, StoredItem } from './indexedDB';

const addLocation = async (location: OpenWeatherMap): Promise<void> => {
  return addItem(LOCATIONS_STORE, location, location.id, location.name);
};

const getLocations = async (): Promise<StoredItem<OpenWeatherMap>[]> => {
  return getItems<OpenWeatherMap>(LOCATIONS_STORE);
};

const deleteLocation = async (locationId: number): Promise<void> => {
  return deleteItem(LOCATIONS_STORE, locationId);
};

export { addLocation, getLocations, deleteLocation };
