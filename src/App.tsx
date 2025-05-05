import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { Header } from './components/Header/Header';
import { HomePage } from './pages/HomePage/HomePage';
import { DetailPage } from './pages/DetailPage/DetailPage';
import { fetchCities } from './store/slices/citiesSlice';
import './styles/main.scss';

export const useAppDispatch = () => useDispatch<AppDispatch>();

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  return (
    <Router>
      <div className="app">
        <Header />
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
