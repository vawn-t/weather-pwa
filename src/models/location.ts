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
