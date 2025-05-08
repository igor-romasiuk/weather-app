import { useState, useEffect, useCallback } from 'react';
import { searchCity, addCity } from '../../store/slices/citiesSlice';
import { fetchWeatherForCity } from '../../store/slices/weatherSlice';
import { useAppDispatch } from '../../App';
import type { City } from '../../types/weather';
import './CitySearch.scss';

export const CitySearch = () => {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  const performSearch = useCallback(
    async (searchTerm: string) => {
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
        } else {
          setError('Failed to search for cities');
        }
      } catch (err) {
        setError('An error occurred while searching');
      } finally {
        setIsSearching(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleAddCity = async (city: City) => {
    try {
      const addAction = await dispatch(addCity(city));
      if (addCity.fulfilled.match(addAction)) {
        dispatch(
          fetchWeatherForCity({
            cityId: city.id,
            lat: city.lat,
            lon: city.lon,
          })
        );

        setQuery('');
        setSearchResults([]);
      }
    } catch (err) {
      setError('Failed to add city');
    }
  };

  return (
    <div className="city-search">
      <div className="city-search__input-container">
        <input
          type="text"
          className="city-search__input"
          placeholder="Search for a city..."
          value={query}
          onChange={handleInputChange}
        />
        {isSearching && <div className="city-search__loading-indicator"></div>}
      </div>

      {error && <div className="city-search__error">{error}</div>}

      {searchResults.length > 0 && (
        <div className="city-search__results">
          <h3>Search Results</h3>
          <ul className="city-search__results-list">
            {searchResults.map((city) => (
              <li key={city.id} className="city-search__result-item">
                <div className="city-search__result-info">
                  <span className="city-search__result-name">{city.name}</span>
                  <span className="city-search__result-details">
                    {city.country} {city.state ? `(${city.state})` : ''}
                  </span>
                </div>
                <button className="city-search__add-btn" onClick={() => handleAddCity(city)}>
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
