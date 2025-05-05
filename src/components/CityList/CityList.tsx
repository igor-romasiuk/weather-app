import type { FC } from 'react';
import type { City } from '../../types/weather';
import { CityCard } from '../CityCard/CityCard';
import './CityList.scss';

interface CityListProps {
  cities: City[];
  onCityClick?: (city: City) => void;
}

export const CityList: FC<CityListProps> = ({ cities, onCityClick }) => {
  return (
    <div className="city-list">
      {cities.map((city) => (
        <CityCard key={city.id} city={city} onClick={onCityClick} />
      ))}
    </div>
  );
};
