import classNames from 'classnames';
import { useEffect, useState } from 'react';

// Utils
import { convertDateToFormattedString } from '@utils';

// Components
import { Text } from '../commons';

interface NetworkStatusProps {
  date: string;
}

const NetworkStatus = ({ date }: NetworkStatusProps) => {
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

  return (
    <Text className={classNames('text-sm', { 'text-red-600': !isOnline })}>
      {isOnline
        ? `Updated as of ${convertDateToFormattedString(date)}`
        : `You are offline`}
    </Text>
  );
};

export default NetworkStatus;
