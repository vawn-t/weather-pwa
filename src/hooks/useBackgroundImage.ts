import { unsplash } from '@utils';
import { useEffect, useState } from 'react';

export const useBackgroundImage = (location: string) => {
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await unsplash.search.getPhotos({
          query: `${location} landscape`, // e.g., "Tokyo landscape"
          perPage: 1, // Get one image
          orientation: 'portrait', // Good for mobile
        });

        if (result.response?.results.length > 0) {
          const imageUrl = result.response.results[0].urls.regular;
          setBackgroundImage(imageUrl);
        } else {
          // Fallback image if no results
          setBackgroundImage(
            'https://via.placeholder.com/1080x1920?text=No+Image'
          );
        }
      } catch (error) {
        console.error('Error fetching Unsplash image:', error);
        setBackgroundImage('https://via.placeholder.com/1080x1920?text=Error');
      }
    };

    if (location) {
      fetchImage();
    }
  }, [location]);

  return backgroundImage;
};
