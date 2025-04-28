import classNames from 'classnames';

// Components
import { Button, Text } from '../commons';

// Constants
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
