import { useState, useEffect, useCallback } from 'react';

import { LocationState, PermissionStatus } from '@models';
import { checkPermissionStatus, getCurrentPosition } from '@utils';

interface UseLocationResult {
  location: LocationState | null;
  error: string | null;
  loading: boolean;
  permissionStatus: PermissionStatus;
  requestPermission: () => Promise<void>;
}

/**
 * Custom hook to detect current location and handle geolocation permissions
 * @param options Configuration options for the Geolocation API
 * @param autoRequest Whether to automatically request location on mount
 * @returns Location state, error, loading status, permission status and request function
 */
export const useLocation = (
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000, // 10 seconds
    maximumAge: 60000, // 1 minute
  },
  autoRequest: boolean = true
): UseLocationResult => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('unknown');

  const requestPermission = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // This will trigger the permission prompt if needed
      const position = await getCurrentPosition(options);

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });

      // Update permission status after successful request
      const status = await checkPermissionStatus();
      setPermissionStatus(status);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          'An unknown error occurred while trying to get your location.'
        );
      }

      // Update permission status in case of error
      const status = await checkPermissionStatus();
      setPermissionStatus(status);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check permission status on mount
  useEffect(() => {
    const checkInitialPermission = async () => {
      const status = await checkPermissionStatus();
      setPermissionStatus(status);

      if (autoRequest || status !== 'granted') {
        requestPermission();
      }
    };

    checkInitialPermission();
  }, []);

  return {
    location,
    error,
    loading,
    permissionStatus,
    requestPermission,
  };
};
