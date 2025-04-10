import { Text } from '../commons';
import { useWeatherIcon } from '@hooks';

const WeatherDescription = () => {
  const iconCode = '01d';
  const weatherIcon = useWeatherIcon(iconCode);

  return (
    <div className="relative flex flex-col items-center justify-center text-white text-center gap-4">
      <img src={weatherIcon} alt="Weather icon" />

      <div className="text-[40px] font-semibold mb-2">Clear</div>
      <Text className="text-[86px]/20">
        24
        <span className="align-top text-4xl ml-0.5">&deg;c</span>
      </Text>
    </div>
  );
};

export default WeatherDescription;
