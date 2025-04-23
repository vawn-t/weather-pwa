// Component
import { SearchIcon } from '../icons';
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
      <div className="flex items-center">
        <svg
          onClick={onGoBack}
          className="mr-2 w-8 h-8 cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
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
