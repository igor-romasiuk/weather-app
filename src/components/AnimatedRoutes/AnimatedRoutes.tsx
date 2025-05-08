import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from '../../pages/HomePage/HomePage';
import { DetailPage } from '../../pages/DetailPage/DetailPage';

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/city/:cityId" element={<DetailPage />} />
      </Routes>
    </AnimatePresence>
  );
};
