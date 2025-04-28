// Components
import { Text } from '../commons';
import { LocationIcon } from '../icons';
import Skeleton from '../Skeleton';

interface LocationDisplayProps {
  location: string;
  isLoading?: boolean;
}

const LocationDisplay = ({
  location,
  isLoading = false,
}: LocationDisplayProps) => {
  return (
    <div className="flex items-center gap-1">
      <LocationIcon />

      {isLoading ? (
        <Skeleton className="min-w-10" />
      ) : (
        <Text className="text-lg" as="h1">
          {location}
        </Text>
      )}
    </div>
  );
};

export default LocationDisplay;
