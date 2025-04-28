import { memo, useCallback } from 'react';

// Hooks
import { useWeatherIcon } from '@hooks';

// Components
import { Button, Text } from '../commons';
import { DeleteIcon } from '../icons';

interface LocationCardProps {
  city: string;
  condition: string;
  humidity: number;
  wind: number;
  icon: string;
  temperature: number;
  id: number;
  onDelete: (id: number) => void;
}

const LocationCard = ({
  city,
  condition,
  humidity,
  wind,
  icon,
  temperature,
  id,
  onDelete,
}: LocationCardProps) => {
  const weatherIcon = useWeatherIcon(icon);

  const handleDelete = useCallback(() => onDelete(id), [id, onDelete]);

  return (
    <section className="bg-[#AAA5A5]/30 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center mb-6 mx-4 relative">
      <Button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 focus:outline-none"
        aria-label="Delete location"
      >
        <DeleteIcon />
      </Button>

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
          {temperature.toFixed()}
          <span className="align-top text-2xl ml-0.5">&deg;c</span>
        </Text>
      </div>
    </section>
  );
};

export default memo(LocationCard);
