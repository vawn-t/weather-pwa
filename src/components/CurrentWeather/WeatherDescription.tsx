// Components
import { Text } from '../commons';

// Hooks
import { useWeatherIcon } from '@hooks';

interface WeatherDescriptionProps {
  iconCode: string;
  temp: number;
  condition: string;
}

const WeatherDescription = ({
  iconCode,
  temp,
  condition,
}: WeatherDescriptionProps) => {
  const weatherIcon = useWeatherIcon(iconCode);

  return (
    <div className="relative flex flex-col items-center justify-center text-white text-center gap-4">
      <img
        width={96}
        height={96}
        src={weatherIcon}
        alt="Weather icon"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      <div className="text-[40px] font-semibold mb-2">{condition}</div>
      <Text className="text-[86px]/20 h-[110px] flex items-center">
        {temp.toFixed()}
        <span className="align-top text-4xl ml-0.5">&deg;c</span>
      </Text>
    </div>
  );
};

export default WeatherDescription;
