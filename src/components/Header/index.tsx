import { MenuIcon } from '../icons';
import LocationDisplay from './LocationDisplay';

interface HeaderProps {
  location: string;
}

const Header = ({ location }: HeaderProps) => {
  return (
    <div className="relative z-10 flex justify-between items-center p-4">
      <LocationDisplay location={location} />
      <MenuIcon />
    </div>
  );
};

export default Header;
