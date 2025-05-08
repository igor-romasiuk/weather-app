import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeatherDetail } from './WeatherDetail';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { routerConfig } from '../../config/routerConfig';
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ cityId: '123' }),
    useNavigate: () => mockNavigate,
}));
jest.mock('../../App', () => ({
    useAppDispatch: () => mockDispatch,
}));
jest.mock('../TemperatureGraph/TemperatureGraph', () => ({
    TemperatureGraph: () => _jsx("div", { "data-testid": "temperature-graph", children: "Temperature Graph" }),
}));
const mockWeatherData = {
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    main: { temp: 15, feels_like: 14, humidity: 76, pressure: 1012 },
    wind: { speed: 4.2, deg: 250 },
};
const mockHourlyForecast = {
    hourly: [
        { dt: 1628432400, temp: 15 },
        { dt: 1628436000, temp: 16 },
    ],
};
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation((selector) => {
        const mockState = {
            cities: {
                items: [
                    { id: 123, name: 'London', country: 'GB', state: 'England', lat: 51.5074, lon: -0.1278 },
                ],
                status: 'succeeded',
                error: null,
            },
            weather: {
                data: {
                    '123': mockWeatherData,
                },
                hourlyForecast: {
                    '123': mockHourlyForecast,
                },
                status: { '123': 'succeeded' },
                errors: {},
            },
        };
        return selector(mockState);
    }),
}));
jest.mock('../../store/slices/weatherSlice', () => ({
    fetchWeatherForCity: jest.fn(),
}));
const renderWithState = (params = {}) => {
    const { cityFound = true, status = 'succeeded', hasHourlyForecast = true, error = null } = params;
    const useParamsMock = jest.spyOn(require('react-router-dom'), 'useParams');
    useParamsMock.mockReturnValue({ cityId: '123' });
    const useSelectorMock = jest.spyOn(require('react-redux'), 'useSelector');
    useSelectorMock.mockImplementation((selector) => {
        const mockState = {
            cities: {
                items: cityFound
                    ? [
                        {
                            id: 123,
                            name: 'London',
                            country: 'GB',
                            state: 'England',
                            lat: 51.5074,
                            lon: -0.1278,
                        },
                    ]
                    : [],
                status: 'succeeded',
                error: null,
            },
            weather: {
                data: status === 'succeeded'
                    ? {
                        '123': mockWeatherData,
                    }
                    : {},
                hourlyForecast: hasHourlyForecast
                    ? {
                        '123': mockHourlyForecast,
                    }
                    : {},
                status: { '123': status },
                errors: error ? { '123': error } : {},
            },
        };
        return selector(mockState);
    });
    render(_jsx(MemoryRouter, { initialEntries: ['/city/123'], ...routerConfig, children: _jsx(Routes, { children: _jsx(Route, { path: "/city/:cityId", element: _jsx(WeatherDetail, {}) }) }) }));
    return { useSelectorMock, useParamsMock };
};
describe('WeatherDetail Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('renders city not found when city is missing', () => {
        renderWithState({ cityFound: false });
        expect(screen.getByText('City not found')).toBeInTheDocument();
        expect(screen.getByText('Back to Cities')).toBeInTheDocument();
    });
    test('navigates back when back button is clicked', async () => {
        renderWithState();
        const user = userEvent.setup();
        const backButton = screen.getByText('← Back to Cities');
        await user.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    test('displays loading state', () => {
        renderWithState({ status: 'loading' });
        expect(screen.getByText('Loading weather data...')).toBeInTheDocument();
    });
    test('displays error state', () => {
        renderWithState({
            status: 'failed',
            error: 'API Error',
        });
        expect(screen.getByText('Failed to load weather data: API Error')).toBeInTheDocument();
    });
    test('displays weather data when loaded successfully', () => {
        renderWithState();
        expect(screen.getByText('London, GB')).toBeInTheDocument();
        expect(screen.getByText('England')).toBeInTheDocument();
        expect(screen.getByText('15°C')).toBeInTheDocument();
        expect(screen.getByText('Feels like: 14°C')).toBeInTheDocument();
        expect(screen.getByText('Clear')).toBeInTheDocument();
        expect(screen.getByText('clear sky')).toBeInTheDocument();
        expect(screen.getByText('Humidity')).toBeInTheDocument();
        expect(screen.getByText('76%')).toBeInTheDocument();
    });
    test('displays temperature graph when hourly forecast is available', () => {
        renderWithState({ hasHourlyForecast: true });
        expect(screen.getByTestId('temperature-graph')).toBeInTheDocument();
    });
    test('does not display temperature graph when hourly forecast is not available', () => {
        renderWithState({ hasHourlyForecast: false });
        expect(screen.queryByTestId('temperature-graph')).not.toBeInTheDocument();
    });
    test('dispatches fetch weather action when city exists and status is idle', () => {
        const mockFetchWeatherAction = { type: 'weather/fetchWeatherForCity' };
        const fetchWeatherForCityMock = jest.requireMock('../../store/slices/weatherSlice').fetchWeatherForCity;
        fetchWeatherForCityMock.mockReturnValue(mockFetchWeatherAction);
        renderWithState({ status: 'idle' });
        expect(mockDispatch).toHaveBeenCalledWith(mockFetchWeatherAction);
        expect(fetchWeatherForCityMock).toHaveBeenCalledWith({
            cityId: 123,
            lat: 51.5074,
            lon: -0.1278,
        });
    });
});
