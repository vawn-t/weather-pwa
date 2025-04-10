import { useState, useEffect } from 'react';

/**
 * Custom hook to load weather icons dynamically based on icon code
 * @param iconCode - The icon code for the weather condition (e.g., '01d', '02n')
 * @returns The loaded icon URL or undefined while loading
 */
export const useWeatherIcon = (iconCode: string): string | undefined => {
  const [weatherIcon, setWeatherIcon] = useState<string>();

  useEffect(() => {
    // Only attempt to load if we have an iconCode
    if (iconCode) {
      // Dynamic import of the weather icon
      import(`@assets/weather-icons/${iconCode}.png`)
        .then((image) => setWeatherIcon(image.default))
        .catch((error) => {
          console.error(`Failed to load weather icon: ${iconCode}`, error);
        });
    }
  }, [iconCode]);

  return weatherIcon;
};
