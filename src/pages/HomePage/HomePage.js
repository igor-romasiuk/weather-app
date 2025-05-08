import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CityList } from '../../components/CityList/CityList';
import { CitySearch } from '../../components/CitySearch/CitySearch';
import { PageTransition } from '../../components/PageTransition/PageTransition';
import './HomePage.scss';
export const HomePage = () => {
    const navigate = useNavigate();
    const { items: cities, status, error } = useSelector((state) => state.cities);
    const handleCityClick = (city) => {
        navigate(`/city/${city.id}`);
    };
    return (_jsx(PageTransition, { children: _jsxs("div", { className: "home-page", children: [_jsx("header", { children: _jsxs("h1", { className: "home-page__title", children: [_jsx("span", { role: "img", "aria-label": "weather", children: "\uD83C\uDF24\uFE0F" }), ' ', "Weather App"] }) }), _jsxs("section", { className: "home-page__search-section", children: [_jsxs("h2", { className: "home-page__section-title", children: [_jsx("span", { role: "img", "aria-label": "search", children: "\uD83D\uDD0D" }), ' ', "Add New City"] }), _jsx(CitySearch, {})] }), _jsxs("section", { className: "home-page__cities-section", children: [_jsxs("h2", { className: "home-page__section-title", children: [_jsx("span", { role: "img", "aria-label": "list", children: "\uD83D\uDCCD" }), ' ', "My Cities"] }), status === 'loading' && (_jsxs("div", { className: "loading-message", children: [_jsx("div", { className: "loading-spinner" }), "Loading cities..."] })), status === 'failed' && (_jsxs("div", { className: "error-message", children: [_jsx("span", { role: "img", "aria-label": "error", children: "\u26A0\uFE0F" }), ' ', error] })), cities.length === 0 && status !== 'loading' && (_jsxs("div", { className: "empty-message", children: [_jsx("span", { role: "img", "aria-label": "empty", children: "\uD83D\uDCDD" }), _jsx("p", { children: "No cities added yet. Search for a city above to add it to your list." })] })), cities.length > 0 && _jsx(CityList, { cities: cities, onCityClick: handleCityClick })] })] }) }));
};
