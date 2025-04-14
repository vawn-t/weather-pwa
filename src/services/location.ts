import { API_ROUTES } from '@constants';
import { OpenWeatherMapLocation } from '@models';

/**
 * Search for locations by name using OpenWeatherMap API
 * @param query - Search query (city name, address)
 * @param count - Maximum number of results (default: 5)
 * @returns Promise with geocoding results
 */
export const searchLocation = async (
  query: string,
  limit: number = 5
): Promise<OpenWeatherMapLocation[]> => {
  try {
    const response = await fetch(API_ROUTES.LOCATION_BY_TEXT(limit, query));

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
