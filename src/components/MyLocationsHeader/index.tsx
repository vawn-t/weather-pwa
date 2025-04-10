import { NavLink } from 'react-router';
import { SearchIcon } from '../icons';
import { Text } from '../commons';

const MyLocationsHeader = () => {
  return (
    <div className="relative z-10 flex justify-between items-center p-4">
      <Text as="h2" className="text-lg font-semibold">
        Saved Locations
      </Text>

      <NavLink to="/my-locations" end>
        <SearchIcon />
      </NavLink>
    </div>
  );
};

export default MyLocationsHeader;
