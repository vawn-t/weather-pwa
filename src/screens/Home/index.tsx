import { HumidityIcon } from '@components';

const Home = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <HumidityIcon />s{' '}
      </div>

      {/* Location & Date */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Paris</h1>
        <div className="text-gray-500">
          <p>June 07</p>
          <p>Updated 6/7/2023 4:55 PM</p>
        </div>
      </div>

      {/* Current Weather */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-6xl font-bold">24°C</span>
          <span className="text-lg">Clear</span>
        </div>

        {/* Weather Status */}
        <div className="flex justify-between text-center">
          <div>
            <p className="text-sm text-gray-500">HUMIDITY</p>
            <p className="font-semibold">56%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">WIND</p>
            <p className="font-semibold">4.63km/h</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">FEELS LIKE</p>
            <p className="font-semibold">22°</p>
          </div>
        </div>
      </div>

      {/* Weekly Forecast */}
      <div className="flex gap-4">
        {[
          { day: 'Wed 16', temp: '22°', wind: '1-5 km/h' },
          { day: 'Thu 17', temp: '25°', wind: '1-5 km/h' },
          { day: 'Fri 18', temp: '23°', wind: '5-10 km/h' },
          { day: 'Sat 19', temp: '25°', wind: '1-5 km/h' },
        ].map((forecast, index) => (
          <div key={index} className="flex-1 text-center">
            <p className="text-sm font-medium mb-1">{forecast.day}</p>
            <p className="text-lg font-bold mb-1">{forecast.temp}</p>
            <p className="text-xs text-gray-500">{forecast.wind}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
