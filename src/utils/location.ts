import { PermissionStatus } from '@models';

export const checkPermissionStatus = async (): Promise<PermissionStatus> => {
  if (!navigator.geolocation) {
    return 'denied';
  }

  // Check if the Permissions API is supported
  if (navigator.permissions && navigator.permissions.query) {
    try {
      const result = await navigator.permissions.query({
        name: 'geolocation',
      });
      return result.state as PermissionStatus;
    } catch (e) {
      console.warn('Permissions API not fully supported', e);
    }
  }

  // Fallback: Check if we have a cached location as an indication of permission
  return location ? 'granted' : 'prompt';
};

export const getCurrentPosition = (
  options: PositionOptions
): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    console.log('!navigator.geolocation', !navigator.geolocation);

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};
