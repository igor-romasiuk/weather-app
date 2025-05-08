import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchWeatherForCity } from '../../store/slices/weatherSlice';
import { removeCity } from '../../store/slices/citiesSlice';
import { useAppDispatch } from '../../App';
import './CityCard.scss';
export const CityCard = ({ city, onClick }) => {
    const dispatch = useAppDispatch();
    const cityId = city.id.toString();
    const weather = useSelector((state) => state.weather.data[cityId]);
    const status = useSelector((state) => state.weather.status[cityId] || 'idle');
    const error = useSelector((state) => state.weather.errors[cityId]);
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
    const handleRefreshWeather = (e) => {
        e.stopPropagation();
        dispatch(fetchWeatherForCity({ cityId: city.id, lat: city.lat, lon: city.lon }));
    };
    const handleRemoveCity = (e) => {
        e.stopPropagation();
        dispatch(removeCity(city.id));
    };
    return (_jsxs("div", { className: "city-card", onClick: handleClick, children: [_jsxs("div", { className: "city-card__header", children: [_jsx("h3", { className: "city-card__name", children: city.name }), _jsx("button", { className: "city-card__remove-button", onClick: handleRemoveCity, title: "Remove city", children: "\u2715" })] }), _jsxs("div", { className: "city-card__details", children: [_jsx("p", { className: "city-card__country", children: city.country }), city.state && _jsx("p", { className: "city-card__state", children: city.state })] }), _jsxs("div", { className: "city-card__coordinates", children: [_jsxs("span", { children: ["Lat: ", city.lat.toFixed(2)] }), _jsxs("span", { children: ["Lon: ", city.lon.toFixed(2)] })] }), status === 'loading' && (_jsxs("div", { className: "city-card__loading", children: [_jsx("div", { className: "loading-spinner" }), "Loading weather..."] })), status === 'failed' && (_jsxs("div", { className: "city-card__error", children: [_jsx("span", { role: "img", "aria-label": "error", children: "\u26A0\uFE0F" }), ' ', error] })), weather && status === 'succeeded' && (_jsxs("div", { className: "city-card__weather", children: [_jsxs("div", { className: "city-card__temperature", children: [Math.round(weather.main.temp), "\u00B0C"] }), _jsxs("div", { className: "city-card__weather-details", children: [_jsx("img", { src: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`, alt: weather.weather[0].description, className: "city-card__weather-icon", loading: "lazy" }), _jsx("span", { className: "city-card__weather-description", children: weather.weather[0].description })] }), _jsxs("div", { className: "city-card__weather-info", children: [_jsxs("span", { children: ["Feels like: ", Math.round(weather.main.feels_like), "\u00B0C"] }), _jsxs("span", { children: ["Humidity: ", weather.main.humidity, "%"] }), _jsxs("span", { children: ["Wind: ", Math.round(weather.wind.speed), " m/s"] })] })] })), _jsx("button", { className: "city-card__refresh-button", onClick: handleRefreshWeather, title: "Update weather data", children: "Update Now" })] }));
};
