import { useEffect, useCallback } from 'react';

// Layouts
import { MobileLayout } from '@layouts';

// Components
import {
  CurrentWeather,
  ForecastSection,
  HomeHeader,
  PermissionGate,
  PullToRefresh,
  SkeletonWeather,
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
    fetchWeatherForCurrentLocation,
    fetchForecast,
  } = useWeather(location);
  const {
    loading: bgLoading,
    backgroundImage,
    refreshBackground,
  } = useBackgroundImage(locationName);

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

  // Handle pull to refresh
  const handleRefresh = useCallback(async () => {
    if (!location) return;

    // A small delay to improve UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Refresh weather data
    await fetchWeatherForCurrentLocation();
    await fetchForecast();

    // Also refresh the background image
    if (locationName) {
      await refreshBackground(locationName);
    }
  }, [
    location,
    fetchWeatherForCurrentLocation,
    fetchForecast,
    locationName,
    refreshBackground,
  ]);

  // Show loading state
  if (weatherLoading || bgLoading) {
    return (
      <MobileLayout className="bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="px-4 py-8">
          <HomeHeader location="Loading..." />
          <SkeletonWeather className="mt-6" />
        </div>
      </MobileLayout>
    );
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
      <PullToRefresh onRefresh={handleRefresh}>
        <HomeHeader location={locationName} />
        <CurrentWeather data={weather} lastUpdated={lastUpdated} />
        <ForecastSection data={forecast} />/
      </PullToRefresh>
    </MobileLayout>
  );
};

export default Home;
