import { NavLink } from 'react-router';

// Components
import { MenuIcon } from '../icons';
import LocationDisplay from './LocationDisplay';

interface HeaderProps {
  location: string;
}

const HomeHeader = ({ location }: HeaderProps) => {
  return (
    <div className="relative z-10 flex justify-between items-center pt-4">
      <LocationDisplay location={location} />

      <NavLink to="/my-locations" end>
        <MenuIcon />
      </NavLink>
    </div>
  );
};

export default HomeHeader;
