import { Text } from '../commons';

const DateDisplay = () => {
  return (
    <div className="relative z-10 text-center my-4">
      <Text as="h1" className="text-[40px] font-semibold mb-1">
        June 07
      </Text>
      <Text className="text-sm shadow">Updated as of 6/7/2023 4:55 PM</Text>
    </div>
  );
};

export default DateDisplay;
