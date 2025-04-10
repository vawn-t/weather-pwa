import { Text } from '../commons';
import { LocationIcon } from '../icons';

interface LocationDisplayProps {
  location: string;
}

const LocationDisplay = ({ location }: LocationDisplayProps) => {
  return (
    <div className="flex items-center gap-1">
      <LocationIcon />
      <Text className="text-lg" as="h1">
        {location}
      </Text>
    </div>
  );
};

export default LocationDisplay;
