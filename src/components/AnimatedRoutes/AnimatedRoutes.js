import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from '../../pages/HomePage/HomePage';
import { DetailPage } from '../../pages/DetailPage/DetailPage';
export const AnimatedRoutes = () => {
    const location = useLocation();
    return (_jsx(AnimatePresence, { mode: "wait", initial: false, children: _jsxs(Routes, { location: location, children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/city/:cityId", element: _jsx(DetailPage, {}) })] }, location.pathname) }));
};
