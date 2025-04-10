import { HumidityIcon, WindIcon, FeelsLikeIcon } from '../icons';
import WeatherDetailItem from './WeatherDetailItem';

const WeatherDetails = () => {
  return (
    <div className="flex justify-between items-center p-4 gap-[75px]">
      <WeatherDetailItem icon={<HumidityIcon />} label="HUMIDITY" value="56%" />
      <WeatherDetailItem icon={<WindIcon />} label="WIND" value="4.63km/h" />
      <WeatherDetailItem
        icon={<FeelsLikeIcon />}
        label="FEELS LIKE"
        value="22°"
      />
    </div>
  );
};

export default WeatherDetails;
