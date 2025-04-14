import { CurrentWeather, ForecastSection, HomeHeader } from '@components';
import { MobileLayout } from '@layouts';
import { useBackgroundImage, useLocation, useWeather } from '@hooks';

const Home = () => {
  const locationTest = 'Tokyo';
  const imgURL = useBackgroundImage(locationTest);

  const { location } = useLocation();

  // TODO: Handle navigate screen required location permission if not granted

  const { locationData, forecast, weather, lastUpdated } = useWeather(location);

  return (
    <MobileLayout
      style={{ '--image-url': `url(${imgURL})` } as React.CSSProperties}
      className="bg-[image:var(--image-url)]"
    >
      <HomeHeader location={locationData} />

      <CurrentWeather data={weather} lastUpdated={lastUpdated} />

      <ForecastSection data={forecast} />
    </MobileLayout>
  );
};

export default Home;
