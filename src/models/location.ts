export interface Location {
  id: string;
  name: string;
  country: string;
}

export interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface OpenWeatherMapLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
}
