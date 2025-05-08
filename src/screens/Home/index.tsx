import { useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

// Layouts
import { MobileLayout } from '@layouts';

// Components
import {
  CurrentWeather,
  ForecastSection,
  HomeHeader,
  PermissionGate,
  PullToRefresh,
} from '@components';

// Hooks
import { useBackgroundImage, useLocation, useWeather } from '@hooks';

// Utils
import { requestNotificationPermission, showWeatherNotification } from '@utils';
import { MESSAGES, TOAST_IDS } from '@constants';

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

    await new Promise((resolve) => setTimeout(resolve, 500));

    await fetchWeatherForCurrentLocation();
    await fetchForecast();

    if (locationName) {
      await refreshBackground(locationName);
    }

    toast.success(MESSAGES.SUCCESS.REFRESH_WEATHER, {
      toastId: TOAST_IDS.HOME_REFRESH_WEATHER,
    });
  }, [
    location,
    fetchWeatherForCurrentLocation,
    fetchForecast,
    locationName,
    refreshBackground,
  ]);

  // Show permission gate if location permission not granted
  if (permissionStatus !== 'granted' && permissionStatus !== 'prompt') {
    return <PermissionGate />;
  }

  return (
    <MobileLayout
      style={
        {
          '--image-url': `url(${backgroundImage || '/default-bg.jpg'})`,
        } as React.CSSProperties
      }
      className="bg-[image:var(--image-url)]"
    >
      <PullToRefresh onRefresh={handleRefresh}>
        <HomeHeader location={locationName} isLoading={weatherLoading} />
        <CurrentWeather
          data={weather}
          lastUpdated={lastUpdated}
          isLoading={weatherLoading}
        />
        <ForecastSection data={forecast} isLoading={weatherLoading} />
      </PullToRefresh>
    </MobileLayout>
  );
};

export default Home;
