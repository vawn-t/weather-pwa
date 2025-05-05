import {
  OPENWEATHER_API_KEY,
  OPENWEATHER_API_URL,
  OPENWEATHER_GEO_API_URL,
} from './keys';

export const API_ROUTES = {
  LOCATION_BY_TEXT: (count: number, query: string) =>
    `${OPENWEATHER_GEO_API_URL}/direct?q=${encodeURIComponent(query)}&limit=${count}&appid=${OPENWEATHER_API_KEY}`,
  WEATHER_BY_COORDINATES: (lat: number, lon: number, units: string) =>
    `${OPENWEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`,
  FORECAST_BY_COORDINATES: (lat: number, lon: number, units: string) =>
    `${OPENWEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`,
};

export const APP_ROUTES = {
  HOME: '/',
  MY_LOCATIONS: '/my-locations',
};
