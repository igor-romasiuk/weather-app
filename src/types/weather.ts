export interface City {
  id: number;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
}

export interface HourlyForecast {
  hourly: Array<{
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  }>;
}

export interface CityData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
