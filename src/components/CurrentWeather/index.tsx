import DateDisplay from './DateDisplay';
import WeatherDescription from './WeatherDescription';
import WeatherDetails from './WeatherDetails';

interface CurrentWeatherProps {}

const CurrentWeather = ({}: CurrentWeatherProps) => {
  return (
    <>
      <DateDisplay />
      <WeatherDescription />
      <WeatherDetails />
    </>
  );
};

export default CurrentWeather;
