import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { CityList } from '../../components/CityList/CityList';
import { CitySearch } from '../../components/CitySearch/CitySearch';
import type { City } from '../../types/weather';
import './HomePage.scss';

export const HomePage = () => {
  const navigate = useNavigate();
  const { items: cities, status, error } = useSelector((state: RootState) => state.cities);

  const handleCityClick = (city: City) => {
    navigate(`/city/${city.id}`);
  };

  return (
    <div className="home-page">
      <h1 className="home-page__title">Weather App</h1>

      <section className="home-page__search-section">
        <h2 className="home-page__section-title">Add New City</h2>
        <CitySearch />
      </section>

      <section className="home-page__cities-section">
        <h2 className="home-page__section-title">My Cities</h2>
        {status === 'loading' && <div className="loading-message">Loading cities...</div>}
        {status === 'failed' && <div className="error-message">{error}</div>}
        {cities.length === 0 && status !== 'loading' && (
          <div className="empty-message">
            No cities added yet. Search for a city above to add it to your list.
          </div>
        )}
        {cities.length > 0 && <CityList cities={cities} onCityClick={handleCityClick} />}
      </section>
    </div>
  );
};
