export interface Location {
  zipCode: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  date: string;
  temperature: {
    high: number;
    low: number;
    average: number;
  };
  precipitation: number;
  humidity: number;
  windSpeed: number;
  windDirection?: string;
}

export interface Forecast {
  location: Location;
  currentConditions: WeatherData;
  dailyForecast: WeatherData[];
  lastUpdated: string;
  source: string;
}
