import { useState } from 'react';
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const resultAction = await dispatch(searchCity(query.trim()));
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
      <form onSubmit={handleSearch} className="city-search__form">
        <input
          type="text"
          className="city-search__input"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="city-search__submit-btn"
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

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
