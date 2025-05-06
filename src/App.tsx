import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { HomePage } from './pages/HomePage/HomePage';
import { DetailPage } from './pages/DetailPage/DetailPage';
import { fetchCities } from './store/slices/citiesSlice';
import { fetchWeatherForCity } from './store/slices/weatherSlice';
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
    <Router>
      <div className="app">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/city/:cityId" element={<DetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
