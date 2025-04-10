import { SearchIcon } from '../icons';
import { Button, Text } from '../commons';

interface MyLocationsHeaderProps {
  onOpenModal: () => void;
}

const MyLocationsHeader = ({ onOpenModal }: MyLocationsHeaderProps) => {
  return (
    <div className="relative z-10 flex justify-between items-center p-4">
      <Text as="h2" className="text-lg font-semibold">
        Saved Locations
      </Text>

      <Button onClick={onOpenModal}>
        <SearchIcon />
      </Button>
    </div>
  );
};

export default MyLocationsHeader;
