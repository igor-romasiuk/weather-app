import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { CityList } from '../../components/CityList/CityList';
import { CitySearch } from '../../components/CitySearch/CitySearch';
import { PageTransition } from '../../components/PageTransition/PageTransition';
import type { City } from '../../types/weather';
import './HomePage.scss';

export const HomePage = () => {
  const navigate = useNavigate();
  const { items: cities, status, error } = useSelector((state: RootState) => state.cities);

  const handleCityClick = (city: City) => {
    navigate(`/city/${city.id}`);
  };

  return (
    <PageTransition>
      <div className="home-page">
        <header>
          <h1 className="home-page__title">
            <span role="img" aria-label="weather">
              🌤️
            </span>{' '}
            Weather App
          </h1>
        </header>

        <section className="home-page__search-section">
          <h2 className="home-page__section-title">
            <span role="img" aria-label="search">
              🔍
            </span>{' '}
            Add New City
          </h2>
          <CitySearch />
        </section>

        <section className="home-page__cities-section">
          <h2 className="home-page__section-title">
            <span role="img" aria-label="list">
              📍
            </span>{' '}
            My Cities
          </h2>

          {status === 'loading' && (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              Loading cities...
            </div>
          )}

          {status === 'failed' && (
            <div className="error-message">
              <span role="img" aria-label="error">
                ⚠️
              </span>{' '}
              {error}
            </div>
          )}

          {cities.length === 0 && status !== 'loading' && (
            <div className="empty-message">
              <span role="img" aria-label="empty">
                📝
              </span>
              <p>No cities added yet. Search for a city above to add it to your list.</p>
            </div>
          )}

          {cities.length > 0 && <CityList cities={cities} onCityClick={handleCityClick} />}
        </section>
      </div>
    </PageTransition>
  );
};
