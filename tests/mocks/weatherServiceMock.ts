// Mock for weatherService.ts
export const getCurrentWeather = jest.fn().mockResolvedValue({
  name: 'London',
  main: { temp: 20, humidity: 50 },
  weather: [{ description: 'Cloudy', icon: '04d' }],
  wind: { speed: 5 },
});

export const get5DayForecast = jest.fn().mockResolvedValue({
  list: [
    {
      dt_txt: '2023-05-01 12:00:00',
      main: { temp: 22 },
      weather: [{ description: 'Sunny', icon: '01d' }],
    },
    {
      dt_txt: '2023-05-02 12:00:00',
      main: { temp: 24 },
      weather: [{ description: 'Clear', icon: '01d' }],
    },
  ],
  city: { name: 'London' },
});

export default { getCurrentWeather, get5DayForecast };
