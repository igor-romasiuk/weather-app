import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { CityList } from '../../components/CityList/CityList';
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
      {status === 'loading' && <div className="loading-message">Loading cities...</div>}
      {status === 'failed' && <div className="error-message">{error}</div>}

      {cities.length > 0 && <CityList cities={cities} onCityClick={handleCityClick} />}
    </div>
  );
};
