import { useState, useEffect } from 'react';
import { forceAppUpdate } from '@utils';

interface NetworkStatusProps {
  className?: string;
}

const NetworkStatus = ({ className = '' }: NetworkStatusProps) => {
  //   const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [showReconnectedMessage, setShowReconnectedMessage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setShowOfflineMessage(false);
      setShowReconnectedMessage(true);
      // Hide reconnected message after 5 seconds
      setTimeout(() => setShowReconnectedMessage(false), 5000);
    };

    const handleOffline = () => {
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = async () => {
    setIsUpdating(true);
    try {
      await forceAppUpdate();
      // Page will reload, no need to reset state
    } catch (error) {
      console.error('Failed to refresh content:', error);
      setIsUpdating(false);
    }
  };

  if (!showOfflineMessage && !showReconnectedMessage) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-0 right-0 mx-auto max-w-xs z-50 ${className}`}
    >
      {showOfflineMessage && (
        <div className="bg-red-500 text-white p-3 rounded-lg shadow-lg text-center">
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            You're offline
          </div>
        </div>
      )}

      {showReconnectedMessage && (
        <div className="bg-green-500 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Connected again
            </div>
            <button
              onClick={handleRefresh}
              disabled={isUpdating}
              className="bg-white text-green-600 px-2 py-1 text-sm rounded hover:bg-green-50 disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Refresh content'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
