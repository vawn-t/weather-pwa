import { useState, useEffect, useCallback } from 'react';

// Services
import {
  getForecastByCoordinates,
  getOpenWeatherMapByCoordinates,
} from '@services';

// Models
import { DailyForecast, LocationState, OpenWeatherMap } from '@models';

// Utils
import { getNext4DaysForecast } from '@utils';

// Constants
import { WEATHER_DATA_DEFAULT } from '@constants';

// Stores
import { addForecast, addWeather, getForecast, getWeather } from '@stores';

interface UseWeatherResult {
  weather: OpenWeatherMap;
  forecast: DailyForecast[];
  lastUpdated: string;
  locationName: string;
  loading: boolean;
  error: string | null;
  asyncFetchWeather: (
    location: LocationState
  ) => Promise<OpenWeatherMap | undefined>;
}

/**
 * Hook to fetch and manage weather data
 * @param autoFetch - Whether to automatically fetch weather for current location
 */
export const useWeather = (
  location: LocationState | null,
  autoFetch: boolean = true
): UseWeatherResult => {
  const [weather, setWeather] = useState<OpenWeatherMap>(WEATHER_DATA_DEFAULT);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [locationName, setLocationName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Load cached data on initial mount
  useEffect(() => {
    const loadCachedData = async () => {
      await loadWeatherFromIndexedDB();
      await loadForecastFromIndexedDB();
    };

    loadCachedData();
  }, []);

  useEffect(() => {
    if (location && autoFetch) {
      fetchWeatherForCurrentLocation();
      fetchForecast();
    }
  }, [location]);

  // Load weather data from IndexedDB
  const loadWeatherFromIndexedDB = async () => {
    try {
      const weatherItems = await getWeather();
      if (weatherItems && weatherItems.length > 0) {
        // Get the most recent weather data
        const sortedWeather = weatherItems.sort(
          (a, b) => b.timestamp - a.timestamp
        );
        const latestWeather = sortedWeather[0];

        setWeather(latestWeather.data);
        setLocationName(latestWeather.name);
        setLastUpdated(
          new Date(latestWeather.timestamp).toLocaleString('en-US', {
            timeZone: 'UTC',
          })
        );

        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to load weather from IndexedDB:', err);
      return false;
    }
  };

  const loadForecastFromIndexedDB = async () => {
    try {
      const forecastData = await getForecast();

      if (forecastData && forecastData.length > 0) {
        // Get the most recent forecast
        const sortedForecasts = forecastData.sort(
          (a, b) => b.timestamp - a.timestamp
        );
        const latestForecast = sortedForecasts[0];

        setForecast(latestForecast.data);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to load forecast from IndexedDB:', err);
      return false;
    }
  };

  const fetchWeatherForCurrentLocation = useCallback(async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      const position = {
        coords: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
        },
        timestamp: location.timestamp,
      } as GeolocationPosition;

      const data = await getOpenWeatherMapByCoordinates(
        position.coords.latitude,
        position.coords.longitude
      );
      setWeather(data);

      const locationResult = await getOpenWeatherMapByCoordinates(
        location.latitude,
        location.longitude
      );

      setLocationName(locationResult.name);
      setLastUpdated(new Date().toLocaleString('en-US', { timeZone: 'UTC' }));

      // Save to IndexedDB
      await addWeather(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching weather data.');
      }
    } finally {
      setLoading(false);
    }
  }, [location]);

  const fetchForecast = useCallback(async () => {
    if (!location) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getForecastByCoordinates(
        location.latitude,
        location.longitude
      );

      const forecastNext4Days = getNext4DaysForecast(result);

      setForecast(forecastNext4Days);

      // Save to IndexedDB
      await addForecast(forecastNext4Days);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching forecast data.');
      }
    } finally {
      setLoading(false);
    }
  }, [location]);

  const asyncFetchWeather = useCallback(async (location: LocationState) => {
    if (!location) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getOpenWeatherMapByCoordinates(
        location.latitude,
        location.longitude
      );

      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching weather data.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    weather,
    locationName,
    loading,
    error,
    lastUpdated,
    forecast,
    asyncFetchWeather,
  };
};
