import { OpenWeatherMapLocation } from '@models';
import { WeatherData } from '../models/weather';

const METEO_API_URL = 'https://api.open-meteo.com/v1';

const OPENWEATHER_API_URL = 'https://api.openweathermap.org/geo/1.0';
const OPENWEATHER_API_KEY = 'f593f86e24c321b810290a90d06930db';

/**
 * Get weather for a specific location by coordinates
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @returns Promise with weather data
 */
export const getWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${METEO_API_URL}/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
    );

    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
};

/**
 * Get weather for the current location
 * @param position - GeolocationPosition from browser API
 * @returns Promise with weather data
 */
export const getCurrentLocationWeather = async (
  position: GeolocationPosition
): Promise<WeatherData> => {
  const { latitude, longitude } = position.coords;
  return getWeatherByCoordinates(latitude, longitude);
};

/**
 * Search for locations by name using OpenWeatherMap API
 * @param query - Search query (city name, address)
 * @param count - Maximum number of results (default: 5)
 * @returns Promise with geocoding results
 */
export const searchLocation = async (
  query: string,
  count: number = 5
): Promise<OpenWeatherMapLocation[]> => {
  try {
    const response = await fetch(
      `${OPENWEATHER_API_URL}/direct?q=${encodeURIComponent(query)}&limit=${count}&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Error searching location: ${response.status}`);
    }

    const data: OpenWeatherMapLocation[] = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to search location:', error);
    throw error;
  }
};

/**
 * Search for location by coordinates using OpenWeatherMap API
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @returns Promise with geocoding result
 */
export const getLocationByCoordinates = async (
  lat: number,
  lon: number
): Promise<OpenWeatherMapLocation> => {
  try {
    const response = await fetch(
      `${OPENWEATHER_API_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(
        `Error searching location by coordinates: ${response.status}`
      );
    }

    const data: OpenWeatherMapLocation[] = await response.json();

    const item = data[0];

    // Transform OpenWeatherMap format to match our GeocodingResult interface
    return item;
  } catch (error) {
    console.error('Failed to search location by coordinates:', error);
    throw error;
  }
};

/**
 * Get weather for a location by name
 * @param locationName - Name of the location to search for
 * @returns Promise with weather data for the first matching location
 */
export const getWeatherByLocationName = async (
  locationName: string
): Promise<{
  weather: WeatherData;
} | null> => {
  try {
    const locations = await searchLocation(locationName);

    if (!locations || locations.length === 0) {
      return null;
    }

    // Get the first (most relevant) location
    const location = locations[0];

    const weather = await getWeatherByCoordinates(location.lat, location.lon);

    return { weather };
  } catch (error) {
    console.error('Failed to fetch weather by location name:', error);
    throw error;
  }
};

/**
 * Get a user-friendly description of the weather based on weather code
 * @param weatherCode - The WMO weather code from the API
 * @returns A user-friendly description of the weather
 */
export const getWeatherDescription = (weatherCode: number): string => {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return weatherCodes[weatherCode] || 'Unknown';
};
