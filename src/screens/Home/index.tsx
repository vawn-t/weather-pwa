import { useEffect } from 'react';

// Layouts
import { MobileLayout } from '@layouts';

// Components
import {
  CurrentWeather,
  ForecastSection,
  HomeHeader,
  LoadingIndicator,
  PermissionGate,
} from '@components';

// Hooks
import { useBackgroundImage, useLocation, useWeather } from '@hooks';

// Utils
import { requestNotificationPermission, showWeatherNotification } from '@utils';

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

  // Handle notification setup when weather data is available
  useEffect(() => {
    const setupNotifications = async () => {
      // Only proceed if we have forecast data
      if (!forecast || forecast.length === 0) return;

      const notificationPermission = await requestNotificationPermission();

      // Show notification if permission is granted
      if (notificationPermission === 'granted') {
        const tomorrowForecast = forecast[0]; // First item in forecast array is tomorrow

        showWeatherNotification(
          `Weather forecast for tomorrow in ${locationName}`,
          {
            body: `Tomorrow: ${tomorrowForecast.temp}°c, ${tomorrowForecast.wind} km/h wind`,
            icon: `/icons/weathers/${tomorrowForecast.iconCode}.png`,
            badge: '/pwa-192x192.png',
            tag: 'weather-forecast', // Used to replace existing notifications
          }
        );
      }
    };

    // Only run notification setup when data is loaded
    if (!weatherLoading && !bgLoading && forecast.length > 0) {
      setupNotifications();
    }
  }, [weatherLoading, bgLoading, forecast, locationName]);

  // Show loading state
  if (weatherLoading || bgLoading) {
    return <LoadingIndicator />;
  }

  // Show permission gate if location permission not granted
  if (permissionStatus !== 'granted' && permissionStatus !== 'prompt') {
    return <PermissionGate />;
  }

  return (
    <MobileLayout
      style={
        {
          '--image-url': `url(${backgroundImage})`,
        } as React.CSSProperties
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
