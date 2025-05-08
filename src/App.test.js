import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App from './App';
import { fetchCities } from './store/slices/citiesSlice';
import { fetchWeatherForCity } from './store/slices/weatherSlice';
import { routerConfig } from './config/routerConfig';
jest.mock('./pages/HomePage/HomePage', () => ({
    HomePage: () => _jsx("div", { "data-testid": "home-page", children: "Home Page" }),
}));
jest.mock('./pages/DetailPage/DetailPage', () => ({
    DetailPage: () => _jsx("div", { "data-testid": "detail-page", children: "Detail Page" }),
}));
jest.mock('./store/slices/citiesSlice', () => ({
    fetchCities: jest.fn(() => ({ type: 'cities/fetchCities' })),
}));
jest.mock('./store/slices/weatherSlice', () => ({
    fetchWeatherForCity: jest.fn((params) => ({
        type: 'weather/fetchForCity',
        payload: params,
    })),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    BrowserRouter: ({ children }) => children,
}));
const mockStore = configureStore();
describe('App Component', () => {
    let store;
    const initialState = {
        cities: {
            items: [
                { id: 1, name: 'New York', lat: 40.7128, lon: -74.006, country: 'US' },
                { id: 2, name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB' },
            ],
            status: 'succeeded',
            error: null,
        },
        weather: {
            data: {},
            hourlyForecast: {},
            status: {},
            errors: {},
        },
    };
    beforeEach(() => {
        store = mockStore(initialState);
        jest.clearAllMocks();
    });
    test('renders the app with router', () => {
        render(_jsx(Provider, { store: store, children: _jsx(MemoryRouter, { initialEntries: ['/'], ...routerConfig, children: _jsx(App, {}) }) }));
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
    test('dispatches fetchCities on mount', () => {
        render(_jsx(Provider, { store: store, children: _jsx(MemoryRouter, { ...routerConfig, children: _jsx(App, {}) }) }));
        const actions = store.getActions();
        expect(actions).toContainEqual({ type: 'cities/fetchCities' });
        expect(fetchCities).toHaveBeenCalledTimes(1);
    });
    test('dispatches fetchWeatherForCity for each city', () => {
        render(_jsx(Provider, { store: store, children: _jsx(MemoryRouter, { ...routerConfig, children: _jsx(App, {}) }) }));
        expect(fetchWeatherForCity).toHaveBeenCalledTimes(2);
        expect(fetchWeatherForCity).toHaveBeenCalledWith({
            cityId: 1,
            lat: 40.7128,
            lon: -74.006,
        });
        expect(fetchWeatherForCity).toHaveBeenCalledWith({
            cityId: 2,
            lat: 51.5074,
            lon: -0.1278,
        });
        const actions = store.getActions();
        expect(actions).toContainEqual({
            type: 'weather/fetchForCity',
            payload: {
                cityId: 1,
                lat: 40.7128,
                lon: -74.006,
            },
        });
        expect(actions).toContainEqual({
            type: 'weather/fetchForCity',
            payload: {
                cityId: 2,
                lat: 51.5074,
                lon: -0.1278,
            },
        });
    });
    test('renders detail page when navigating to a city route', () => {
        render(_jsx(Provider, { store: store, children: _jsx(MemoryRouter, { initialEntries: ['/city/1'], ...routerConfig, children: _jsx(App, {}) }) }));
        expect(screen.getByTestId('detail-page')).toBeInTheDocument();
    });
});
