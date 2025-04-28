import { JSX } from 'react';

// Components
import { Text } from '../commons';
import { Skeleton } from '../';

interface WeatherDetailItemProps {
  icon: JSX.Element; // Icon can be a string or a React component
  label: string;
  value: string | number;
  isLoading?: boolean;
}

const WeatherDetailItem = ({
  isLoading = false,
  icon,
  label,
  value,
}: WeatherDetailItemProps) => {
  // Replace icon placeholder with actual icon component or image
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl mb-1">{icon}</span>
      <Text className="text-sm font-medium whitespace-nowrap">{label}</Text>
      {isLoading ? (
        <Skeleton className="h-5" />
      ) : (
        <Text className="text-sm font-medium">{value}</Text>
      )}
    </div>
  );
};

export default WeatherDetailItem;
