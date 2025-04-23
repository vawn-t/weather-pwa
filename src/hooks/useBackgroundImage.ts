import { useEffect, useState, useCallback } from 'react';

import { unsplash } from '@utils';
export const useBackgroundImage = (location: string) => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchImage = useCallback(async (locationName: string) => {
    setLoading(true);
    try {
      const result = await unsplash.search.getPhotos({
        query: `${locationName} landscape`,
        perPage: 1,
        orientation: 'portrait',
      });

      if (result.response!.results.length > 0) {
        const imageUrl = result.response!.results[0].urls.regular;
        setBackgroundImage(imageUrl);
      } else {
        setBackgroundImage('https://fakeimg.pl/400x600?text=.');
      }
    } catch (error) {
      console.error('Error fetching Unsplash image:', error);
      setBackgroundImage('https://fakeimg.pl/400x600?text=.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBackground = useCallback(
    async (locationName: string) => {
      if (locationName) {
        await fetchImage(locationName);
      }
    },
    [fetchImage]
  );

  useEffect(() => {
    if (location) {
      fetchImage(location);
    }
  }, [location, fetchImage]);

  return { loading, backgroundImage, refreshBackground };
};
