import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWeatherForCity } from '../../store/slices/weatherSlice';
import { useAppDispatch } from '../../App';
import { TemperatureGraph } from '../TemperatureGraph/TemperatureGraph';
import './WeatherDetail.scss';
export const WeatherDetail = () => {
    const { cityId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const city = useSelector((state) => state.cities.items.find((city) => city.id.toString() === cityId));
    const weather = useSelector((state) => cityId ? state.weather.data[cityId] : undefined);
    const hourlyForecast = useSelector((state) => cityId ? state.weather.hourlyForecast[cityId] : undefined);
    const status = useSelector((state) => cityId ? state.weather.status[cityId] || 'idle' : 'idle');
    const error = useSelector((state) => (cityId ? state.weather.errors[cityId] : null));
    useEffect(() => {
        if (cityId && city && status === 'idle') {
            dispatch(fetchWeatherForCity({ cityId: city.id, lat: city.lat, lon: city.lon }));
        }
    }, [dispatch, cityId, city, status]);
    if (!city) {
        return (_jsxs("div", { className: "weather-detail weather-detail--error", children: [_jsx("h2", { children: "City not found" }), _jsx("button", { onClick: () => navigate('/'), children: "Back to Cities" })] }));
    }
    return (_jsxs("div", { className: "weather-detail", children: [_jsx("button", { className: "weather-detail__back", onClick: () => navigate('/'), children: "\u2190 Back to Cities" }), _jsxs("h1", { className: "weather-detail__city-name", children: [city.name, ", ", city.country] }), city.state && _jsx("h2", { className: "weather-detail__state", children: city.state }), _jsxs("div", { className: "weather-detail__coordinates", children: [_jsxs("span", { children: ["Latitude: ", city.lat.toFixed(4)] }), _jsxs("span", { children: ["Longitude: ", city.lon.toFixed(4)] })] }), status === 'loading' && (_jsx("div", { className: "weather-detail__loading", children: "Loading weather data..." })), status === 'failed' && (_jsxs("div", { className: "weather-detail__error", children: ["Failed to load weather data: ", error] })), weather && status === 'succeeded' && (_jsxs("div", { className: "weather-detail__content", children: [_jsxs("div", { className: "weather-detail__main", children: [_jsxs("div", { className: "weather-detail__temperature", children: [_jsxs("span", { className: "weather-detail__temp-value", children: [Math.round(weather.main.temp), "\u00B0C"] }), _jsxs("span", { className: "weather-detail__feels-like", children: ["Feels like: ", Math.round(weather.main.feels_like), "\u00B0C"] })] }), _jsxs("div", { className: "weather-detail__condition", children: [_jsx("img", { src: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`, alt: weather.weather[0].description, className: "weather-detail__icon" }), _jsxs("div", { className: "weather-detail__description", children: [_jsx("h3", { children: weather.weather[0].main }), _jsx("p", { children: weather.weather[0].description })] })] })] }), _jsxs("div", { className: "weather-detail__stats", children: [_jsxs("div", { className: "weather-detail__stat-item", children: [_jsx("h4", { children: "Humidity" }), _jsxs("p", { children: [weather.main.humidity, "%"] })] }), _jsxs("div", { className: "weather-detail__stat-item", children: [_jsx("h4", { children: "Pressure" }), _jsxs("p", { children: [weather.main.pressure, " hPa"] })] }), _jsxs("div", { className: "weather-detail__stat-item", children: [_jsx("h4", { children: "Wind Speed" }), _jsxs("p", { children: [Math.round(weather.wind.speed), " m/s"] })] }), _jsxs("div", { className: "weather-detail__stat-item", children: [_jsx("h4", { children: "Wind Direction" }), _jsxs("p", { children: [weather.wind.deg, "\u00B0"] })] })] }), hourlyForecast && _jsx(TemperatureGraph, { forecast: hourlyForecast })] }))] }));
};
