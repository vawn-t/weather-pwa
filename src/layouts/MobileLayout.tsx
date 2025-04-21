import { ReactNode } from 'react';
import classNames from 'classnames';

interface MobileLayoutProps extends React.HTMLProps<HTMLElement> {
  children: ReactNode;
}

const MobileLayout = ({ children, className, ...rest }: MobileLayoutProps) => {
  return (
    <main
      className={classNames(
        'p-[var(--content-padding)] px-6 relative flex flex-1 flex-col h-screen w-screen bg-cover bg-center overflow-auto',
        className
      )}
      {...rest}
    >
      {children}
    </main>
  );
};

export default MobileLayout;
