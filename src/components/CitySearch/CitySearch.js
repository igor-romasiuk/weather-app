import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { searchCity, addCity } from '../../store/slices/citiesSlice';
import { fetchWeatherForCity } from '../../store/slices/weatherSlice';
import { useAppDispatch } from '../../App';
import './CitySearch.scss';
export const CitySearch = () => {
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => {
            clearTimeout(timerId);
        };
    }, [query]);
    const performSearch = useCallback(async (searchTerm) => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        setError(null);
        try {
            const resultAction = await dispatch(searchCity(searchTerm.trim()));
            if (searchCity.fulfilled.match(resultAction)) {
                setSearchResults(resultAction.payload);
                if (resultAction.payload.length === 0) {
                    setError('No cities found. Try a different search.');
                }
            }
            else {
                setError('Failed to search for cities');
            }
        }
        catch (err) {
            setError('An error occurred while searching');
        }
        finally {
            setIsSearching(false);
        }
    }, [dispatch]);
    useEffect(() => {
        performSearch(debouncedQuery);
    }, [debouncedQuery, performSearch]);
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };
    const handleAddCity = async (city) => {
        try {
            const addAction = await dispatch(addCity(city));
            if (addCity.fulfilled.match(addAction)) {
                dispatch(fetchWeatherForCity({
                    cityId: city.id,
                    lat: city.lat,
                    lon: city.lon,
                }));
                setQuery('');
                setSearchResults([]);
            }
        }
        catch (err) {
            setError('Failed to add city');
        }
    };
    return (_jsxs("div", { className: "city-search", children: [_jsxs("div", { className: "city-search__input-container", children: [_jsx("input", { type: "text", className: "city-search__input", placeholder: "Search for a city...", value: query, onChange: handleInputChange }), isSearching && _jsx("div", { className: "city-search__loading-indicator" })] }), error && _jsx("div", { className: "city-search__error", children: error }), searchResults.length > 0 && (_jsxs("div", { className: "city-search__results", children: [_jsx("h3", { children: "Search Results" }), _jsx("ul", { className: "city-search__results-list", children: searchResults.map((city) => (_jsxs("li", { className: "city-search__result-item", children: [_jsxs("div", { className: "city-search__result-info", children: [_jsx("span", { className: "city-search__result-name", children: city.name }), _jsxs("span", { className: "city-search__result-details", children: [city.country, " ", city.state ? `(${city.state})` : ''] })] }), _jsx("button", { className: "city-search__add-btn", onClick: () => handleAddCity(city), children: "Add" })] }, city.id))) })] }))] }));
};
