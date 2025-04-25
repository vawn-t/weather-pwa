import { API_ROUTES } from '@constants';
import { OpenWeatherMap, OpenWeatherMapForecast } from '@models';

/**
 * Get weather for a specific location by coordinates using OpenWeatherMap API
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @param units - Units of measurement ('standard', 'metric', or 'imperial')
 * @returns Promise with OpenWeatherMap weather data
 */
export const getOpenWeatherMapByCoordinates = async (
  lat: number,
  lon: number,
  units: 'standard' | 'metric' | 'imperial' = 'metric'
): Promise<OpenWeatherMap> => {
  const response = await fetch(
    API_ROUTES.WEATHER_BY_COORDINATES(lat, lon, units)
  );

  if (!response.ok) {
    const error = new Error(
      `Error fetching OpenWeatherMap data: ${response.status} ${response.statusText}`
    );
    console.error(error);
    throw error;
  }

  return await response.json();
};

/**
 * Get weather forecast for a specific location by coordinates using OpenWeatherMap API
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @param units - Units of measurement ('standard', 'metric', or 'imperial')
 * @returns Promise with OpenWeatherMap forecast data
 */
export const getForecastByCoordinates = async (
  lat: number,
  lon: number,
  units: 'standard' | 'metric' | 'imperial' = 'metric'
): Promise<OpenWeatherMapForecast> => {
  const response = await fetch(
    API_ROUTES.FORECAST_BY_COORDINATES(lat, lon, units)
  );

  if (!response.ok) {
    const error = new Error(
      `Error fetching OpenWeatherMap forecast: ${response.status} ${response.statusText}`
    );
    console.error(error);
    throw error;
  }

  return await response.json();
};
