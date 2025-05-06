import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { fetchWeatherForCity } from '../../store/slices/weatherSlice';
import { useAppDispatch } from '../../App';
import { TemperatureGraph } from '../TemperatureGraph/TemperatureGraph';
import './WeatherDetail.scss';

export const WeatherDetail = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const city = useSelector((state: RootState) =>
    state.cities.items.find((city) => city.id.toString() === cityId)
  );

  const weather = useSelector((state: RootState) =>
    cityId ? state.weather.data[cityId] : undefined
  );

  const hourlyForecast = useSelector((state: RootState) =>
    cityId ? state.weather.hourlyForecast[cityId] : undefined
  );

  const status = useSelector((state: RootState) =>
    cityId ? state.weather.status[cityId] || 'idle' : 'idle'
  );

  const error = useSelector((state: RootState) => (cityId ? state.weather.errors[cityId] : null));

  useEffect(() => {
    if (cityId && city && status === 'idle') {
      dispatch(fetchWeatherForCity({ cityId: city.id, lat: city.lat, lon: city.lon }));
    }
  }, [dispatch, cityId, city, status]);

  if (!city) {
    return (
      <div className="weather-detail weather-detail--error">
        <h2>City not found</h2>
        <button onClick={() => navigate('/')}>Back to Cities</button>
      </div>
    );
  }

  return (
    <div className="weather-detail">
      <button className="weather-detail__back" onClick={() => navigate('/')}>
        ← Back to Cities
      </button>

      <h1 className="weather-detail__city-name">
        {city.name}, {city.country}
      </h1>
      {city.state && <h2 className="weather-detail__state">{city.state}</h2>}

      <div className="weather-detail__coordinates">
        <span>Latitude: {city.lat.toFixed(4)}</span>
        <span>Longitude: {city.lon.toFixed(4)}</span>
      </div>

      {status === 'loading' && (
        <div className="weather-detail__loading">Loading weather data...</div>
      )}

      {status === 'failed' && (
        <div className="weather-detail__error">Failed to load weather data: {error}</div>
      )}

      {weather && status === 'succeeded' && (
        <div className="weather-detail__content">
          <div className="weather-detail__main">
            <div className="weather-detail__temperature">
              <span className="weather-detail__temp-value">{Math.round(weather.main.temp)}°C</span>
              <span className="weather-detail__feels-like">
                Feels like: {Math.round(weather.main.feels_like)}°C
              </span>
            </div>

            <div className="weather-detail__condition">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].description}
                className="weather-detail__icon"
              />
              <div className="weather-detail__description">
                <h3>{weather.weather[0].main}</h3>
                <p>{weather.weather[0].description}</p>
              </div>
            </div>
          </div>

          <div className="weather-detail__stats">
            <div className="weather-detail__stat-item">
              <h4>Humidity</h4>
              <p>{weather.main.humidity}%</p>
            </div>
            <div className="weather-detail__stat-item">
              <h4>Pressure</h4>
              <p>{weather.main.pressure} hPa</p>
            </div>
            <div className="weather-detail__stat-item">
              <h4>Wind Speed</h4>
              <p>{Math.round(weather.wind.speed)} m/s</p>
            </div>
            <div className="weather-detail__stat-item">
              <h4>Wind Direction</h4>
              <p>{weather.wind.deg}°</p>
            </div>
          </div>

          {hourlyForecast && <TemperatureGraph forecast={hourlyForecast} />}
        </div>
      )}
    </div>
  );
};
