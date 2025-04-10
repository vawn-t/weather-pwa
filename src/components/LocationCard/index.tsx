import { useWeatherIcon } from '@hooks';
import { Text } from '../commons';

interface LocationCardProps {
  city: string;
  condition: string;
  humidity: number;
  wind: number;
  icon: string;
  temperature: number;
}

const LocationCard = ({
  city,
  condition,
  humidity,
  wind,
  icon,
  temperature,
}: LocationCardProps) => {
  const weatherIcon = useWeatherIcon(icon);

  return (
    <section className="bg-[#AAA5A5]/30 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center mb-6 mx-4">
      {/* Left Side Info */}
      <div className="flex flex-col text-gray-200">
        <Text className="text-2xl font-semibold mb-1">{city}</Text>
        <Text className="font-medium">{condition}</Text>
        <span className="text-xs font-light">
          Humidity <Text as="span">{humidity}%</Text>
        </span>
        <span className="text-xs font-light">
          Wind <Text as="span">{wind}km/h</Text>
        </span>
      </div>

      {/* Right Side Icon & Temp */}
      <div className="flex flex-col items-end gap-1">
        <img className="w-10" src={weatherIcon} alt="Weather icon" />
        <Text className="text-5xl font-medium">
          {temperature}
          <span className="align-top text-2xl ml-0.5">&deg;c</span>
        </Text>
      </div>
    </section>
  );
};

export default LocationCard;
