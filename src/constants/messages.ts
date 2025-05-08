export const MESSAGES = {
  SUCCESS: {
    LOCATION_ADD: 'Location added successfully',
    LOCATION_UPDATE: 'Location updated successfully',
    LOCATION_DELETE: 'Location deleted successfully',
    REFRESH_WEATHER: 'Weather data refreshed successfully',
  },
  ERROR: {
    LOCATION_ADD: 'Failed to add location',
    LOCATION_UPDATE: 'Failed to update location',
    LOCATION_DELETE: 'Failed to delete location',
    LOG: (err: unknown) => `Error: ${err}`,
    COMMON: 'Something went wrong, please try again later',
  },
  WARNING: {
    LOCATION_EXISTS: 'Location already exists',
  },
};

export const TOAST_IDS = {
  LOCATION_ADD_SUCCESS: 'add-location-success',
  LOCATION_ADD_FAILED: 'add-location-failed',
  LOCATION_UPDATE_SUCCESS: 'update-location-success',
  LOCATION_UPDATE_FAILED: 'update-location-failed',
  LOCATION_DELETE_SUCCESS: 'delete-location-success',
  LOCATION_DELETE_FAILED: 'delete-location-failed',
  HOME_REFRESH_WEATHER: 'home-refresh-weather',
  MY_LOCATIONS_REFRESH_WEATHER: 'my-locations-refresh-weather',
  LOCATION_EXISTS: 'location-exists',
  COMMON: 'common-error',
};
