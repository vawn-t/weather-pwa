// Hooks
import { useWeatherIcon } from '@hooks';

// Components
import { Text } from '../commons';

interface ForecastCardProps {
  day: string;
  iconCode: string;
  temp: string;
  wind: string;
}

const ForecastCard = ({ day, iconCode, temp, wind }: ForecastCardProps) => {
  const weatherIcon = useWeatherIcon(iconCode);

  return (
    <div className="flex flex-col items-center text-center px-2 gap-3">
      <Text className="text-sm" variant="secondary">
        {day}
      </Text>

      <div className="flex flex-col items-center gap-1">
        <img width={44} height={44} src={weatherIcon} alt="Weather icon" />

        <Text variant="secondary">{temp}&deg;</Text>

        <div className="flex flex-col items-center">
          <Text className="text-[10px]" variant="secondary">
            {wind}
          </Text>
          <Text as="span" className="text-[10px]" variant="secondary">
            km/h
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
