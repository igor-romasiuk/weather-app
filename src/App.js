import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatedRoutes } from './components/AnimatedRoutes/AnimatedRoutes';
import { fetchCities } from './store/slices/citiesSlice';
import { fetchWeatherForCity } from './store/slices/weatherSlice';
import { routerConfig } from './config/routerConfig';
import './styles/main.scss';
export const useAppDispatch = () => useDispatch();
function App() {
    const dispatch = useAppDispatch();
    const cities = useSelector((state) => state.cities.items);
    useEffect(() => {
        dispatch(fetchCities());
    }, [dispatch]);
    useEffect(() => {
        cities.forEach((city) => {
            dispatch(fetchWeatherForCity({
                cityId: city.id,
                lat: city.lat,
                lon: city.lon,
            }));
        });
    }, [cities, dispatch]);
    return (_jsx(Router, { ...routerConfig, children: _jsx("div", { className: "app", children: _jsx("main", { children: _jsx(AnimatedRoutes, {}) }) }) }));
}
export default App;
