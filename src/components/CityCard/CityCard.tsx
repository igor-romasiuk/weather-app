import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { FC } from 'react';
import type { City } from '../../types/weather';
import type { RootState } from '../../store';
import { fetchWeatherForCity } from '../../store/slices/weatherSlice';
import { removeCity } from '../../store/slices/citiesSlice';
import { useAppDispatch } from '../../App';
import './CityCard.scss';

interface CityCardProps {
  city: City;
  onClick?: (city: City) => void;
}

export const CityCard: FC<CityCardProps> = ({ city, onClick }) => {
  const dispatch = useAppDispatch();
  const cityId = city.id.toString();

  const weather = useSelector((state: RootState) => state.weather.data[cityId]);
  const status = useSelector((state: RootState) => state.weather.status[cityId] || 'idle');
  const error = useSelector((state: RootState) => state.weather.errors[cityId]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWeatherForCity({ cityId: city.id, lat: city.lat, lon: city.lon }));
    }
  }, [dispatch, city.id, city.lat, city.lon, status]);

  const handleClick = () => {
    if (onClick) {
      onClick(city);
    }
  };

  const handleRefreshWeather = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(fetchWeatherForCity({ cityId: city.id, lat: city.lat, lon: city.lon }));
  };

  const handleRemoveCity = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeCity(city.id));
  };

  return (
    <div className="city-card" onClick={handleClick}>
      <div className="city-card__header">
        <h3 className="city-card__name">{city.name}</h3>
        <button className="city-card__remove-button" onClick={handleRemoveCity} title="Remove city">
          ✕
        </button>
      </div>
      <div className="city-card__details">
        <p className="city-card__country">{city.country}</p>
        {city.state && <p className="city-card__state">{city.state}</p>}
      </div>
      <div className="city-card__coordinates">
        <span>Lat: {city.lat.toFixed(2)}</span>
        <span>Lon: {city.lon.toFixed(2)}</span>
      </div>

      {status === 'loading' && (
        <div className="city-card__loading">
          <div className="loading-spinner"></div>
          Loading weather...
        </div>
      )}

      {status === 'failed' && (
        <div className="city-card__error">
          <span role="img" aria-label="error">
            ⚠️
          </span>{' '}
          {error}
        </div>
      )}

      {weather && status === 'succeeded' && (
        <div className="city-card__weather">
          <div className="city-card__temperature">{Math.round(weather.main.temp)}°C</div>
          <div className="city-card__weather-details">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="city-card__weather-icon"
              loading="lazy"
            />
            <span className="city-card__weather-description">{weather.weather[0].description}</span>
          </div>
          <div className="city-card__weather-info">
            <span>Feels like: {Math.round(weather.main.feels_like)}°C</span>
            <span>Humidity: {weather.main.humidity}%</span>
            <span>Wind: {Math.round(weather.wind.speed)} m/s</span>
          </div>
        </div>
      )}

      <button
        className="city-card__refresh-button"
        onClick={handleRefreshWeather}
        title="Update weather data"
      >
        Update Now
      </button>
    </div>
  );
};
