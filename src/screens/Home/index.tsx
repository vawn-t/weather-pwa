import { useEffect } from 'react';
import { requestNotificationPermission, showWeatherNotification } from '@utils';

import {
  CurrentWeather,
  ForecastSection,
  HomeHeader,
  PermissionGate,
  LoadingIndicator,
} from '@components';
import { MobileLayout } from '@layouts';
import { useBackgroundImage, useLocation, useWeather } from '@hooks';

const Home = () => {
  const { location, permissionStatus } = useLocation();

  const {
    loading: weatherLoading,
    locationName,
    forecast,
    weather,
    lastUpdated,
  } = useWeather(location);

  const { loading: bgLoading, backgroundImage } =
    useBackgroundImage(locationName);

  // Request notification permission and show weather notification when component mounts
  useEffect(() => {
    const setupNotifications = async () => {
      const notificationPermission = await requestNotificationPermission();

      // If permission granted and we have forecast data, show notification
      if (
        notificationPermission === 'granted' &&
        forecast &&
        forecast.length > 0
      ) {
        const tomorrowForecast = forecast[0]; // First item in forecast array is tomorrow

        showWeatherNotification(
          `Weather forecast for tomorrow in ${locationName}`,
          {
            body: `Tomorrow: ${tomorrowForecast.temp}°c, ${tomorrowForecast.wind} km/h wind`,
            icon: `/icons/weathers/${tomorrowForecast.iconCode}.png`, // Adjust path based on your icon storage
            badge: '/pwa-192x192.png',
            tag: 'weather-forecast', // Used to replace existing notifications
            requireInteraction: true,
          }
        );
      }
    };

    if (!weatherLoading && !bgLoading && forecast.length > 0) {
      setupNotifications();
    }
  }, [weatherLoading, bgLoading, forecast, locationName]);

  if (weatherLoading || bgLoading) {
    return <LoadingIndicator />;
  }

  if (permissionStatus !== 'granted') {
    return <PermissionGate />;
  }

  return (
    <MobileLayout
      style={
        { '--image-url': `url(${backgroundImage})` } as React.CSSProperties
      }
      className="bg-[image:var(--image-url)]"
    >
      <HomeHeader location={locationName} />

      <CurrentWeather data={weather} lastUpdated={lastUpdated} />

      <ForecastSection data={forecast} />
    </MobileLayout>
  );
};

export default Home;
