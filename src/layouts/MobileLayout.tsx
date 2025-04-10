import { ReactNode } from 'react';
import classNames from 'classnames';

interface MobileLayoutProps extends React.HTMLProps<HTMLElement> {
  children: ReactNode;
}

const MobileLayout = ({ children, className, ...rest }: MobileLayoutProps) => {
  return (
    <main
      className={classNames(
        'py-8h px-6 relative flex flex-col  h-screen w-screen bg-cover bg-center',
        className
      )}
      {...rest}
    >
      {children}
    </main>
  );
};

export default MobileLayout;
