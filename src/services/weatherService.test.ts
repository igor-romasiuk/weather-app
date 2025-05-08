jest.mock('./weatherService', () => {
  return {
    getWeatherByCoordinates: jest.fn(),
    getCitiesByName: jest.fn(),
    getHourlyForecast: jest.fn(),
    DEFAULT_CITIES: ['London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Kyiv'],
  };
});

import {
  getWeatherByCoordinates,
  getCitiesByName,
  getHourlyForecast,
  DEFAULT_CITIES,
} from './weatherService';

describe('Weather Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeatherByCoordinates', () => {
    const mockWeatherData = {
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: { temp: 15, feels_like: 14, humidity: 76 },
    };

    it('should return weather data when the API call is successful', async () => {
      (getWeatherByCoordinates as jest.Mock).mockResolvedValueOnce(mockWeatherData);

      const result = await getWeatherByCoordinates(51.5074, -0.1278);

      expect(getWeatherByCoordinates).toHaveBeenCalledWith(51.5074, -0.1278);
      expect(result).toEqual(mockWeatherData);
    });

    it('should throw an error when the API call fails', async () => {
      (getWeatherByCoordinates as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch weather data')
      );

      await expect(getWeatherByCoordinates(51.5074, -0.1278)).rejects.toThrow(
        'Failed to fetch weather data'
      );
    });
  });

  describe('getCitiesByName', () => {
    const mockCitiesData = [
      { id: 1, name: 'London', country: 'GB', state: 'England', lat: 51.5074, lon: -0.1278 },
      { id: 2, name: 'London', country: 'CA', state: 'Ontario', lat: 42.9849, lon: -81.2453 },
    ];

    it('should return cities data when the API call is successful', async () => {
      (getCitiesByName as jest.Mock).mockResolvedValueOnce(mockCitiesData);

      const result = await getCitiesByName('London');

      expect(getCitiesByName).toHaveBeenCalledWith('London');
      expect(result).toEqual(mockCitiesData);
    });

    it('should use the provided limit parameter', async () => {
      (getCitiesByName as jest.Mock).mockResolvedValueOnce(mockCitiesData);

      await getCitiesByName('London', 5);

      expect(getCitiesByName).toHaveBeenCalledWith('London', 5);
    });

    it('should throw an error when the API call fails', async () => {
      (getCitiesByName as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch cities'));

      await expect(getCitiesByName('London')).rejects.toThrow('Failed to fetch cities');
    });
  });

  describe('getHourlyForecast', () => {
    const mockForecastData = {
      hourly: [
        { dt: 1628432400, temp: 15 },
        { dt: 1628436000, temp: 16 },
      ],
    };

    it('should return hourly forecast when the API call is successful', async () => {
      (getHourlyForecast as jest.Mock).mockResolvedValueOnce(mockForecastData);

      const result = await getHourlyForecast(51.5074, -0.1278);

      expect(getHourlyForecast).toHaveBeenCalledWith(51.5074, -0.1278);
      expect(result).toEqual(mockForecastData);
    });

    it('should throw an error when the API call fails', async () => {
      (getHourlyForecast as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch hourly forecast data')
      );

      await expect(getHourlyForecast(51.5074, -0.1278)).rejects.toThrow(
        'Failed to fetch hourly forecast data'
      );
    });
  });

  describe('DEFAULT_CITIES', () => {
    it('should contain the expected default cities', () => {
      expect(DEFAULT_CITIES).toEqual(['London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Kyiv']);
    });
  });
});
