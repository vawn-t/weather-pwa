// Components
import { Text } from '../commons';
import Skeleton from '../Skeleton';

// Hooks
import { useWeatherIcon } from '@hooks';

interface WeatherDescriptionProps {
  iconCode: string;
  temp: number;
  condition: string;
  isLoading?: boolean;
}

const WeatherDescription = ({
  iconCode,
  temp,
  condition,
  isLoading = false,
}: WeatherDescriptionProps) => {
  const weatherIcon = useWeatherIcon(iconCode);

  return (
    <div className="relative flex flex-col items-center justify-center text-white text-center gap-4 max-w-36 mx-auto">
      {isLoading ? (
        <Skeleton className="w-24 h-24 aspect-square rounded-full" />
      ) : (
        <img
          width={96}
          height={96}
          src={weatherIcon}
          alt="Weather icon"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      )}

      {isLoading ? (
        <Skeleton className="h-10" />
      ) : (
        <Text className="text-[40px] font-semibold mb-2">{condition}</Text>
      )}

      {isLoading ? (
        <Skeleton className="h-28" />
      ) : (
        <Text className="text-[86px]/20 h-[110px] flex items-center">
          {temp.toFixed()}
          <span className="align-top text-4xl ml-0.5">&deg;c</span>
        </Text>
      )}
    </div>
  );
};

export default WeatherDescription;
