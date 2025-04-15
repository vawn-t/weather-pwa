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
