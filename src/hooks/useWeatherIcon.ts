import { useState, useEffect } from 'react';

// Pre-import all weather icons
const weatherIcons: Record<string, string> = {
  '01d': new URL('/icons/weathers/01d.png', import.meta.url).href,
  '01n': new URL('/icons/weathers/01n.png', import.meta.url).href,
  '02d': new URL('/icons/weathers/02d.png', import.meta.url).href,
  '02n': new URL('/icons/weathers/02n.png', import.meta.url).href,
  '03d': new URL('/icons/weathers/03d.png', import.meta.url).href,
  '03n': new URL('/icons/weathers/03n.png', import.meta.url).href,
  '04d': new URL('/icons/weathers/04d.png', import.meta.url).href,
  '04n': new URL('/icons/weathers/04n.png', import.meta.url).href,
  '09d': new URL('/icons/weathers/09d.png', import.meta.url).href,
  '09n': new URL('/icons/weathers/09n.png', import.meta.url).href,
  '10d': new URL('/icons/weathers/10d.png', import.meta.url).href,
  '10n': new URL('/icons/weathers/10n.png', import.meta.url).href,
  '11d': new URL('/icons/weathers/11d.png', import.meta.url).href,
  '11n': new URL('/icons/weathers/11n.png', import.meta.url).href,
  '13d': new URL('/icons/weathers/13d.png', import.meta.url).href,
  '13n': new URL('/icons/weathers/13n.png', import.meta.url).href,
  '50d': new URL('/icons/weathers/50d.png', import.meta.url).href,
  '50n': new URL('/icons/weathers/50n.png', import.meta.url).href,
};

/**
 * Custom hook to load weather icons dynamically based on icon code
 * @param iconCode - The icon code for the weather condition (e.g., '01d', '02n')
 * @returns The loaded icon URL or undefined while loading
 */
export const useWeatherIcon = (iconCode: string): string | undefined => {
  const [weatherIcon, setWeatherIcon] = useState<string>();

  useEffect(() => {
    if (iconCode) {
      setWeatherIcon(weatherIcons[iconCode] || weatherIcons['01d']);
    }
  }, [iconCode]);

  return weatherIcon;
};
