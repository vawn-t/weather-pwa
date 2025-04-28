import { JSX, useMemo } from 'react';

// Models
import { OpenWeatherMap } from '@models';

// Components
import DateDisplay from './DateDisplay';
import WeatherDescription from './WeatherDescription';
import WeatherDetails from './WeatherDetails';
import { FeelsLikeIcon, HumidityIcon, WindIcon } from '../icons';

export type WeatherDetail = {
  label: string;
  value: string | number;
  icon: JSX.Element;
};

interface CurrentWeatherProps {
  data: OpenWeatherMap;
  lastUpdated: string;
  isLoading?: boolean;
}

const CurrentWeather = ({
  data,
  lastUpdated,
  isLoading = false,
}: CurrentWeatherProps) => {
  const {
    main: { humidity, feels_like, temp },
    wind,
    weather,
  } = data;

  const detailData: WeatherDetail[] = useMemo(
    () => [
      {
        label: 'HUMIDITY',
        value: `${humidity}%`,
        icon: <HumidityIcon />,
      },
      {
        label: 'WIND',
        value: `${wind.speed}km/h`,
        icon: <WindIcon />,
      },
      {
        label: 'FEELS LIKE',
        value: `${feels_like.toFixed()}°`,
        icon: <FeelsLikeIcon />,
      },
    ],
    [wind, humidity, feels_like]
  );

  return (
    <>
      <DateDisplay date={lastUpdated} isLoading={isLoading} />
      <WeatherDescription
        isLoading={isLoading}
        condition={weather[0].main}
        iconCode={weather[0].icon}
        temp={temp}
      />
      <WeatherDetails data={detailData} isLoading={isLoading} />
    </>
  );
};

export default CurrentWeather;
