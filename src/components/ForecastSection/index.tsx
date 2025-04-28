// Models
import { DailyForecast } from '@models';

// Components
import ForecastCard from './ForecastCard';

import { SkeletonForecast } from '../';

interface ForecastSectionProps {
  data: DailyForecast[];
  isLoading?: boolean;
}

const ForecastSection = ({ data, isLoading = false }: ForecastSectionProps) => (
  <section className="relative z-10 w-full p-4 pb-8 bg-[#535353]/60 backdrop-blur-none rounded-3xl flex justify-around">
    {isLoading ? (
      [...Array(4)].map((_, index) => <SkeletonForecast key={index} />)
    ) : (
      <>
        {data.map((forecast, index) => (
          <ForecastCard
            key={forecast.day + index}
            day={forecast.day}
            iconCode={forecast.iconCode}
            temp={forecast.temp}
            wind={forecast.wind}
          />
        ))}
      </>
    )}
  </section>
);

export default ForecastSection;
