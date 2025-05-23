const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const ONE_CALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';
export const getWeatherByCoordinates = async (lat, lon) => {
    if (!API_KEY) {
        throw new Error('OpenWeather API key is not configured');
    }
    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return response.json();
};
export const getCitiesByName = async (cityName, limit = 10) => {
    if (!API_KEY) {
        throw new Error('OpenWeather API key is not configured');
    }
    const response = await fetch(`${GEO_URL}/direct?q=${cityName}&limit=${limit}&appid=${API_KEY}`);
    if (!response.ok) {
        throw new Error('Failed to fetch cities');
    }
    return response.json();
};
export const getHourlyForecast = async (lat, lon) => {
    if (!API_KEY) {
        throw new Error('OpenWeather API key is not configured');
    }
    const response = await fetch(`${ONE_CALL_URL}?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=metric&appid=${API_KEY}`);
    if (!response.ok) {
        throw new Error('Failed to fetch hourly forecast data');
    }
    return response.json();
};
export const DEFAULT_CITIES = ['London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Kyiv'];
