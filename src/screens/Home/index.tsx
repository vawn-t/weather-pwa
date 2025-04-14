import { CurrentWeather, ForecastSection, HomeHeader } from '@components';
import { MobileLayout } from '@layouts';
import { useBackgroundImage, useWeather } from '@hooks';

const Home = () => {
  const location = 'Tokyo';
  const imgURL = useBackgroundImage(location);

  const { locationData, forecast, currentWeather, lastUpdated } = useWeather();

  return (
    <MobileLayout
      style={{ '--image-url': `url(${imgURL})` } as React.CSSProperties}
      className="bg-[image:var(--image-url)]"
    >
      <HomeHeader location={locationData} />

      <CurrentWeather data={currentWeather} lastUpdated={lastUpdated} />

      <ForecastSection data={forecast} />
    </MobileLayout>
  );
};

export default Home;
