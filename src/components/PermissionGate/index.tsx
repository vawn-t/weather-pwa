import classNames from 'classnames';

import { Button, Text } from '../commons';

import { COLORS } from '@constants';

const PermissionGate = () => {
  return (
    <main
      className={classNames(
        'fixed inset-0 z-50 flex flex-col items-center justify-center p-6',
        COLORS.GRADIENT
      )}
    >
      <div className="max-w-md text-center">
        <svg
          className="w-24 h-24 mx-auto mb-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        <Text as="h1" className="text-2xl font-bold mb-4">
          Location Access Required
        </Text>

        <Text className="mb-6">
          This app requires access to your location to provide accurate weather
          forecasts.
        </Text>

        <div>
          <Text className="text-yellow-300 mb-4">
            Location permission was not granted. You'll need to enable location
            access in your browser/device settings.
          </Text>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#391A49] font-semibold py-3 px-6 rounded-lg w-full"
            >
              I've enabled location access
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PermissionGate;
