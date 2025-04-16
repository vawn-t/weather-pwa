import { getNewDate } from '@utils';
import { Text } from '../commons';
import NetworkStatus from '../NetworkStatus';

interface DateDisplayProps {
  date: string;
}

const DateDisplay = ({ date }: DateDisplayProps) => {
  return (
    <div className="relative z-10 text-center my-4">
      <Text as="h1" className="text-[40px] font-semibold mb-1">
        {getNewDate()}
      </Text>

      <div className="mt-2 flex justify-center">
        <NetworkStatus date={date} />
      </div>
    </div>
  );
};

export default DateDisplay;
