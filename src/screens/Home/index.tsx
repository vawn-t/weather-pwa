import { CurrentWeather, ForecastSection, HomeHeader } from '@components';
import { MobileLayout } from '@layouts';
import { useBackgroundImage } from '@hooks';

const Home = () => {
  const location = 'Tokyo';
  const imgURL = useBackgroundImage(location);

  return (
    <MobileLayout
      style={{ '--image-url': `url(${imgURL})` } as React.CSSProperties}
      className="bg-[image:var(--image-url)] "
    >
      <HomeHeader location="Paris" />

      <CurrentWeather />
      <ForecastSection />
    </MobileLayout>
  );
};

export default Home;
