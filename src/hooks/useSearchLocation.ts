import { searchLocation } from '@services';
import { useState } from 'react';

export const useSearchLocation = (limit: number = 3) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const findLocations = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchLocation(query, limit);

      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching locations.');
      }

      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, findLocations };
};
