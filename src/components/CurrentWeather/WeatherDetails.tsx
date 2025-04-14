import { WeatherDetail } from '.';
import WeatherDetailItem from './WeatherDetailItem';

interface WeatherDetailProps {
  data: WeatherDetail[];
}

const WeatherDetails = ({ data }: WeatherDetailProps) => {
  return (
    <div className="flex justify-between items-center p-4 gap-[75px]">
      {data.map((item, index) => (
        <WeatherDetailItem
          key={index}
          icon={item.icon}
          label={item.label}
          value={item.value}
        />
      ))}
    </div>
  );
};

export default WeatherDetails;
