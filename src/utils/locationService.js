/**
 * Service to handle location search and related functionality
 */

// Replace this with your actual API endpoint
const API_BASE_URL = 'https://api.example.com';

/**
 * Search for locations based on query string
 * @param {string} query - The search query
 * @returns {Promise<Array>} Array of location results
 */
export const searchLocations = async (query) => {
  try {
    // For development/demo, return mock data
    if (process.env.NODE_ENV === 'development') {
      return mockSearch(query);
    }

    // Actual API call for production
    const response = await fetch(
      `${API_BASE_URL}/locations/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Failed to search locations');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

/**
 * Mock search function for development
 * @param {string} query - The search query
 * @returns {Promise<Array>} Array of mock location results
 */
const mockSearch = async (query) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockLocations = [
    {
      id: 1,
      name: 'New York',
      country: 'United States',
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: 2,
      name: 'London',
      country: 'United Kingdom',
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    {
      id: 3,
      name: 'Tokyo',
      country: 'Japan',
      coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    {
      id: 4,
      name: 'Paris',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    {
      id: 5,
      name: 'Sydney',
      country: 'Australia',
      coordinates: { lat: -33.8688, lng: 151.2093 },
    },
    {
      id: 6,
      name: 'Berlin',
      country: 'Germany',
      coordinates: { lat: 52.52, lng: 13.405 },
    },
    {
      id: 7,
      name: 'Madrid',
      country: 'Spain',
      coordinates: { lat: 40.4168, lng: -3.7038 },
    },
    {
      id: 8,
      name: 'Rome',
      country: 'Italy',
      coordinates: { lat: 41.9028, lng: 12.4964 },
    },
  ];

  // Filter locations based on query
  const lowercaseQuery = query.toLowerCase();
  return mockLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(lowercaseQuery) ||
      location.country.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Save locations to local storage
 * @param {Array} locations - Array of location objects to save
 */
export const saveLocationsToStorage = (locations) => {
  localStorage.setItem('savedLocations', JSON.stringify(locations));
};

/**
 * Get saved locations from local storage
 * @returns {Array} Array of saved location objects
 */
export const getSavedLocations = () => {
  const savedLocations = localStorage.getItem('savedLocations');
  return savedLocations ? JSON.parse(savedLocations) : [];
};
