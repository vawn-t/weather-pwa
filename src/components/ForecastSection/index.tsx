// Models
import { DailyForecast } from '@models';

// Components
import ForecastCard from './ForecastCard';

interface ForecastSectionProps {
  data: DailyForecast[];
}

const ForecastSection = ({ data }: ForecastSectionProps) => {
  return (
    <section className="relative z-10 w-full p-4 pb-8 bg-[#535353]/60 backdrop-blur-none rounded-3xl flex justify-around">
      {data.map((forecast, index) => (
        <ForecastCard
          key={forecast.day + index}
          day={forecast.day}
          iconCode={forecast.iconCode}
          temp={forecast.temp}
          wind={forecast.wind}
        />
      ))}
    </section>
  );
};

export default ForecastSection;
