// Component
import { BackIcon, SearchIcon } from '../icons';
import { Button, Text } from '../commons';

interface MyLocationsHeaderProps {
  onOpenModal: () => void;
  onGoBack: () => void;
}

const MyLocationsHeader = ({
  onOpenModal,
  onGoBack,
}: MyLocationsHeaderProps) => {
  return (
    <div className="relative z-10 flex justify-between items-center pt-4">
      <div className="flex items-center cursor-pointer" onClick={onGoBack}>
        <BackIcon />
        <Text as="h2" className="text-lg font-semibold">
          Saved Locations
        </Text>
      </div>

      <Button onClick={onOpenModal}>
        <SearchIcon />
      </Button>
    </div>
  );
};

export default MyLocationsHeader;
