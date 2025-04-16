import { useEffect, useState } from 'react';

interface NetworkStatusProps {
  className?: string;
}

const NetworkStatus = ({ className = '' }: NetworkStatusProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className={`bg-red-600 text-white py-1 px-3 rounded-md ${className}`}>
      You are offline
    </div>
  );
};

export default NetworkStatus;
