import ForecastCard from './ForecastCard';

const ForecastSection = () => {
  return (
    <section className="relative z-10 w-full p-4 pb-8 bg-[#535353]/60 backdrop-blur-none rounded-3xl flex justify-around ">
      <ForecastCard day="Wed 16" iconCode="01d" temp="22" wind="1-5" />
      <ForecastCard day="Thu 17" iconCode="01d" temp="25" wind="1-5" />
      <ForecastCard day="Fri 18" iconCode="01d" temp="23" wind="5-10" />
      <ForecastCard day="Sat 19" iconCode="01d" temp="25" wind="1-5" />
    </section>
  );
};

export default ForecastSection;
