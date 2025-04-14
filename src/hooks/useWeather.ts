import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentLocationWeather,
  getLocationByCoordinates,
  getWeatherByLocationName,
} from '@services';
import { WeatherData } from '../models/weather';
import { useLocation } from './useLocation';
import { OpenWeatherMapLocation } from '@models';

interface UseWeatherResult {
  weatherData: WeatherData;
  locationData: OpenWeatherMapLocation;
  loading: boolean;
  error: string | null;
  searchWeatherByLocation: (query: string) => Promise<void>;
}

const LOCATION_DATA_DEFAULT: OpenWeatherMapLocation = {
  name: '',
  lat: 0,
  lon: 0,
  country: '',
  state: '',
};

const WEATHER_DATA_DEFAULT: WeatherData = {
  latitude: 0,
  longitude: 0,
  generationtime_ms: 0,
  utc_offset_seconds: 0,
  timezone: '',
  timezone_abbreviation: '',
  elevation: 0,
  current_weather: {
    temperature: 0,
    windspeed: 0,
    winddirection: 0,
    weathercode: 0,
    time: '',
  },
  daily: {
    time: [],
    weathercode: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    sunrise: [],
    sunset: [],
  },
};

/**
 * Hook to fetch and manage weather data
 * @param autoFetch - Whether to automatically fetch weather for current location
 */
export const useWeather = (autoFetch: boolean = true): UseWeatherResult => {
  const [weatherData, setWeatherData] =
    useState<WeatherData>(WEATHER_DATA_DEFAULT);
  const [locationData, setLocationData] = useState<OpenWeatherMapLocation>(
    LOCATION_DATA_DEFAULT
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { location, error: locationError } = useLocation(undefined, autoFetch);

  // Fetch weather data for current location when available
  useEffect(() => {
    if (location && autoFetch) {
      fetchWeatherForCurrentLocation();
    }
  }, [location]);

  // Handle location error
  useEffect(() => {
    if (locationError) {
      setError(locationError);
    }
  }, [locationError]);

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

      const data = await getCurrentLocationWeather(position);
      setWeatherData(data);

      const locationResult = await getLocationByCoordinates(
        location.latitude,
        location.longitude
      );

      setLocationData(locationResult);
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

  const searchWeatherByLocation = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getWeatherByLocationName(query);

      if (result) {
        setWeatherData(result.weather);
      } else {
        setError('No matching location found.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while searching for weather data.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    weatherData,
    locationData,
    loading,
    error,
    searchWeatherByLocation,
  };
};
