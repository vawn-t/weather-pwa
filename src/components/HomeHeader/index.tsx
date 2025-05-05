import { NavLink } from 'react-router';

// Components
import { MenuIcon } from '../icons';
import LocationDisplay from './LocationDisplay';
import { APP_ROUTES } from '@constants';

interface HeaderProps {
  location: string;
  isLoading?: boolean;
}

const HomeHeader = ({ location, isLoading = false }: HeaderProps) => {
  return (
    <div className="relative z-10 flex justify-between items-center pt-4">
      <LocationDisplay location={location} isLoading={isLoading} />

      <NavLink to={APP_ROUTES.MY_LOCATIONS} end>
        <MenuIcon />
      </NavLink>
    </div>
  );
};

export default HomeHeader;
