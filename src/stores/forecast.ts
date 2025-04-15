import { FORECAST_STORE } from '@constants';
import { DailyForecast } from '@models';
import { addItem, deleteItem, getItems, StoredItem } from './indexedDB';

// Due to this is unique
const forecastId = 0;
const forecastName = 'forecastName';

const addForecast = async (forecast: DailyForecast[]): Promise<void> => {
  return addItem(FORECAST_STORE, forecast, forecastId, forecastName);
};

const getForecast = async (): Promise<StoredItem<DailyForecast[]>[]> => {
  return getItems<DailyForecast[]>(FORECAST_STORE);
};

const deleteForecast = async (): Promise<void> => {
  return deleteItem(FORECAST_STORE, forecastId);
};

export { addForecast, getForecast, deleteForecast };
