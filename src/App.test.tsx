import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App from './App';
import { fetchCities } from './store/slices/citiesSlice';
import { fetchWeatherForCity } from './store/slices/weatherSlice';
import { routerConfig } from './config/routerConfig';

jest.mock('./pages/HomePage/HomePage', () => ({
  HomePage: () => <div data-testid="home-page">Home Page</div>,
}));

jest.mock('./pages/DetailPage/DetailPage', () => ({
  DetailPage: () => <div data-testid="detail-page">Detail Page</div>,
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
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
}));

const mockStore = configureStore();

describe('App Component', () => {
  let store: any;
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
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']} {...routerConfig}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('dispatches fetchCities on mount', () => {
    render(
      <Provider store={store}>
        <MemoryRouter {...routerConfig}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'cities/fetchCities' });
    expect(fetchCities).toHaveBeenCalledTimes(1);
  });

  test('dispatches fetchWeatherForCity for each city', () => {
    render(
      <Provider store={store}>
        <MemoryRouter {...routerConfig}>
          <App />
        </MemoryRouter>
      </Provider>
    );

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
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/city/1']} {...routerConfig}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('detail-page')).toBeInTheDocument();
  });
});
