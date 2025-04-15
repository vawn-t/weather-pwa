import { WEATHER_STORE } from '@constants';
import { OpenWeatherMap } from '@models';
import { addItem, deleteItem, getItems, StoredItem } from './indexedDB';

const addWeather = async (weather: OpenWeatherMap): Promise<void> => {
  return addItem(WEATHER_STORE, weather, weather.id, weather.name);
};

const getWeather = async (): Promise<StoredItem<OpenWeatherMap>[]> => {
  return getItems<OpenWeatherMap>(WEATHER_STORE);
};

const deleteWeather = async (weatherId: number): Promise<void> => {
  return deleteItem(WEATHER_STORE, weatherId);
};

export { addWeather, getWeather, deleteWeather };
