import { CurrentWeather, ForecastSection, HomeHeader } from '@components';
import { MobileLayout } from '@layouts';
import { useBackgroundImage, useWeather } from '@hooks';

const Home = () => {
  const location = 'Tokyo';
  const imgURL = useBackgroundImage(location);

  const { loading, locationData } = useWeather();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MobileLayout
      style={{ '--image-url': `url(${imgURL})` } as React.CSSProperties}
      className="bg-[image:var(--image-url)] "
    >
      <HomeHeader location={locationData.name} />

      <CurrentWeather />
      <ForecastSection />
    </MobileLayout>
  );
};

export default Home;
