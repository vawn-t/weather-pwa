// Components
import { WeatherDetail } from '.';
import WeatherDetailItem from './WeatherDetailItem';

interface WeatherDetailProps {
  data: WeatherDetail[];
}

const WeatherDetails = ({ data }: WeatherDetailProps) => {
  return (
    <div className="flex justify-between items-center py-4">
      {data.map((item, index) => (
        <WeatherDetailItem
          key={item.label + index}
          icon={item.icon}
          label={item.label}
          value={item.value}
        />
      ))}
    </div>
  );
};

export default WeatherDetails;
