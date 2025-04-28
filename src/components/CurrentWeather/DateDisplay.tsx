//Utils
import { getNewDate } from '@utils';

// Components
import { Text } from '../commons';
import NetworkStatus from '../NetworkStatus';
import Skeleton from '../Skeleton';

interface DateDisplayProps {
  isLoading?: boolean;
  date: string;
}

const DateDisplay = ({ isLoading, date }: DateDisplayProps) => {
  return (
    <div className="relative z-10 text-center my-4 max-w-60 mx-auto">
      <Text as="h1" className="text-[40px] font-semibold mb-1">
        {getNewDate()}
      </Text>

      <div className="mt-2 flex justify-center">
        {isLoading ? <Skeleton /> : <NetworkStatus date={date} />}
      </div>
    </div>
  );
};

export default DateDisplay;
