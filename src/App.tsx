import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import type { RootState, AppDispatch } from './store';
import { CityList } from './components/CityList/CityList';
import { fetchCities } from './store/slices/citiesSlice';
import type { City } from './types/weather';
import './styles/main.scss';

export const useAppDispatch = () => useDispatch<AppDispatch>();

function AppContent() {
  const dispatch = useAppDispatch();
  const { items: cities, status, error } = useSelector((state: RootState) => state.cities);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCities());
    }
  }, [status, dispatch]);

  const handleCityClick = (city: City) => {
    console.log('Selected city:', city);
  };

  return (
    <div className="app">
      {status === 'loading' && <div className="loading-message">Loading cities...</div>}
      {status === 'failed' && <div className="error-message">{error}</div>}

      <Routes>
        <Route path="/" element={<CityList cities={cities} onCityClick={handleCityClick} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
