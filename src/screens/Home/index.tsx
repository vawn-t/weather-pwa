import { CurrentWeather, ForecastSection, Header } from '@components';
import { MobileLayout } from '@layouts';

const Home = () => {
  return (
    <MobileLayout>
      <Header location="Paris" />

      <CurrentWeather />
      <ForecastSection />
    </MobileLayout>
  );
};

export default Home;
