import { convertDateToFormattedString, getNewDate } from '@utils';
import { Text } from '../commons';

interface DateDisplayProps {
  date: string;
}

const DateDisplay = ({ date }: DateDisplayProps) => {
  return (
    <div className="relative z-10 text-center my-4">
      <Text as="h1" className="text-[40px] font-semibold mb-1">
        {getNewDate()}
      </Text>
      <Text className="text-sm">
        Updated as of {convertDateToFormattedString(date)}
      </Text>
    </div>
  );
};

export default DateDisplay;
