import { jsx as _jsx } from "react/jsx-runtime";
import { CityCard } from '../CityCard/CityCard';
import './CityList.scss';
export const CityList = ({ cities, onCityClick }) => {
    return (_jsx("div", { className: "city-list", children: cities.map((city) => (_jsx(CityCard, { city: city, onClick: onCityClick }, city.id))) }));
};
