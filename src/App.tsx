import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { AnimatedRoutes } from './components/AnimatedRoutes/AnimatedRoutes';
import { fetchCities } from './store/slices/citiesSlice';
import { fetchWeatherForCity } from './store/slices/weatherSlice';
import { routerConfig } from './config/routerConfig';
import './styles/main.scss';

export const useAppDispatch = () => useDispatch<AppDispatch>();

function App() {
  const dispatch = useAppDispatch();
  const cities = useSelector((state: RootState) => state.cities.items);

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    cities.forEach((city) => {
      dispatch(
        fetchWeatherForCity({
          cityId: city.id,
          lat: city.lat,
          lon: city.lon,
        })
      );
    });
  }, [cities, dispatch]);

  return (
    <Router {...routerConfig}>
      <div className="app">
        <main>
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
