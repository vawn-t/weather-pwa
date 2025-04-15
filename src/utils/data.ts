import { DailyForecast, OpenWeatherMap, OpenWeatherMapForecast } from '@models';

/**
 * Takes the raw weather forecast data and transforms it into a simplified daily format
 * @param data The raw response from the OpenWeatherMap API
 * @returns An array of simplified daily forecasts
 */
function processForecastData(data: OpenWeatherMapForecast): DailyForecast[] {
  if (!data || !data.list || !Array.isArray(data.list)) {
    return [];
  }

  const dailyForecasts = new Map<string, OpenWeatherMap[]>();

  // Group forecast items by day
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    if (!dailyForecasts.has(dayKey)) {
      dailyForecasts.set(dayKey, []);
    }

    dailyForecasts.get(dayKey)?.push(item);
  });

  return Array.from(dailyForecasts.entries()).map(([dateKey, items]) => {
    const maxTempItem = items.reduce(
      (prev, current) => (current.main.temp > prev.main.temp ? current : prev),
      items[0]
    );

    const date = new Date(dateKey);
    const dayName = date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
    });

    // Find min and max wind speed
    const minWind = Math.floor(
      Math.min(...items.map((item) => item.wind.speed))
    );
    const maxWind = Math.ceil(
      Math.max(...items.map((item) => item.wind.speed))
    );

    return {
      day: dayName,
      iconCode: maxTempItem.weather[0].icon,
      temp: Math.round(maxTempItem.main.temp).toString(),
      wind: `${minWind}-${maxWind}`,
    };
  });
}

/**
 * Alternative implementation that returns forecasts for 4 days, starting from tomorrow
 * @param data The raw response from the OpenWeatherMap API
 * @returns An array of simplified daily forecasts for the next 5 days
 */
export function getNext4DaysForecast(
  data: OpenWeatherMapForecast
): DailyForecast[] {
  const processed = processForecastData(data);

  // Skip today (first item) and return the next 4 days
  return processed.slice(1, 5);
}
