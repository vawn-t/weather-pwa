import { useState, useEffect, useCallback } from 'react';

import {
  getForecastByCoordinates,
  getOpenWeatherMapByCoordinates,
} from '@services';
import { DailyForecast, LocationState, OpenWeatherMap } from '@models';
import { getNext5DaysForecast } from '@utils';
import { WEATHER_DATA_DEFAULT } from '@constants';

interface UseWeatherResult {
  weather: OpenWeatherMap;
  forecast: DailyForecast[];
  lastUpdated: string;
  locationData: string;
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
  location?: LocationState,
  autoFetch: boolean = true
): UseWeatherResult => {
  const [weather, setWeather] = useState<OpenWeatherMap>(WEATHER_DATA_DEFAULT);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [locationData, setLocationData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    if (location && autoFetch) {
      fetchWeatherForCurrentLocation();
      fetchForecast();
    }
  }, [location]);

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

      setLocationData(locationResult.name);

      setLastUpdated(new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
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

      setForecast(getNext5DaysForecast(result));
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
    locationData,
    loading,
    error,
    lastUpdated,
    forecast,
    asyncFetchWeather,
  };
};
