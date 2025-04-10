import { useBackgroundImage } from '@hooks';
import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = 'Tokyo';
  const imgURL = useBackgroundImage(location);

  return (
    <main
      style={{ '--image-url': `url(${imgURL})` } as React.CSSProperties}
      className="py-8h px-6 bg-[image:var(--image-url)] relative flex flex-col  h-screen w-screen bg-cover bg-center"
    >
      {children}
    </main>
  );
};

export default MobileLayout;
