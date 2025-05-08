import { jsx as _jsx } from "react/jsx-runtime";
import { screen, fireEvent } from '@testing-library/react';
import { CityCard } from './CityCard';
import { renderWithRedux } from '../../../tests/utils/testUtils';
import { fetchWeatherForCity } from '../../store/slices/weatherSlice';
import { removeCity } from '../../store/slices/citiesSlice';
jest.mock('../../store/slices/weatherSlice', () => ({
    fetchWeatherForCity: jest.fn().mockImplementation(() => ({ type: 'weather/fetchForCity' })),
}));
jest.mock('../../store/slices/citiesSlice', () => ({
    removeCity: jest.fn().mockImplementation((id) => ({ type: 'cities/removeCity', payload: id })),
}));
describe('CityCard Component', () => {
    const mockCity = {
        id: 1,
        name: 'New York',
        lat: 40.7128,
        lon: -74.006,
        country: 'US',
        state: 'NY',
    };
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('renders basic city information', () => {
        renderWithRedux(_jsx(CityCard, { city: mockCity }));
        expect(screen.getByText('New York')).toBeInTheDocument();
        expect(screen.getByText('US')).toBeInTheDocument();
        expect(screen.getByText('NY')).toBeInTheDocument();
        expect(screen.getByText('Lat: 40.71')).toBeInTheDocument();
        expect(screen.getByText('Lon: -74.01')).toBeInTheDocument();
    });
    test('renders loading state when weather is loading', () => {
        renderWithRedux(_jsx(CityCard, { city: mockCity }), {
            preloadedState: {
                weather: {
                    data: {},
                    hourlyForecast: {},
                    status: { '1': 'loading' },
                    errors: {},
                },
                cities: { items: [], status: 'idle', error: null },
            },
        });
        expect(screen.getByText('Loading weather...')).toBeInTheDocument();
    });
    test('renders error state when weather fetch fails', () => {
        renderWithRedux(_jsx(CityCard, { city: mockCity }), {
            preloadedState: {
                weather: {
                    data: {},
                    hourlyForecast: {},
                    status: { '1': 'failed' },
                    errors: { '1': 'Failed to load weather' },
                },
                cities: { items: [], status: 'idle', error: null },
            },
        });
        expect(screen.getByText('Failed to load weather')).toBeInTheDocument();
    });
    test('renders weather data when fetch succeeds', () => {
        renderWithRedux(_jsx(CityCard, { city: mockCity }), {
            preloadedState: {
                weather: {
                    data: {
                        '1': {
                            main: {
                                temp: 22.5,
                                feels_like: 23.2,
                                humidity: 65,
                                pressure: 1012,
                            },
                            weather: [
                                {
                                    main: 'Clouds',
                                    description: 'scattered clouds',
                                    icon: '03d',
                                },
                            ],
                            wind: {
                                speed: 5.2,
                                deg: 180,
                            },
                        },
                    },
                    hourlyForecast: {},
                    status: { '1': 'succeeded' },
                    errors: {},
                },
                cities: { items: [], status: 'idle', error: null },
            },
        });
        expect(screen.getByText('23°C')).toBeInTheDocument();
        expect(screen.getByText('scattered clouds')).toBeInTheDocument();
        expect(screen.getByText('Feels like: 23°C')).toBeInTheDocument();
        expect(screen.getByText('Humidity: 65%')).toBeInTheDocument();
        expect(screen.getByText('Wind: 5 m/s')).toBeInTheDocument();
        expect(screen.getByAltText('scattered clouds')).toHaveAttribute('src', 'https://openweathermap.org/img/wn/03d@2x.png');
    });
    test('dispatches fetchWeatherForCity when component mounts', () => {
        renderWithRedux(_jsx(CityCard, { city: mockCity }));
        expect(fetchWeatherForCity).toHaveBeenCalledWith({
            cityId: mockCity.id,
            lat: mockCity.lat,
            lon: mockCity.lon,
        });
    });
    test('dispatches fetchWeatherForCity when update button is clicked', () => {
        renderWithRedux(_jsx(CityCard, { city: mockCity }));
        jest.clearAllMocks();
        const updateButton = screen.getByText('Update Now');
        fireEvent.click(updateButton);
        expect(fetchWeatherForCity).toHaveBeenCalledWith({
            cityId: mockCity.id,
            lat: mockCity.lat,
            lon: mockCity.lon,
        });
    });
    test('dispatches removeCity when remove button is clicked', () => {
        renderWithRedux(_jsx(CityCard, { city: mockCity }));
        const removeButton = screen.getByTitle('Remove city');
        fireEvent.click(removeButton);
        expect(removeCity).toHaveBeenCalledWith(mockCity.id);
    });
    test('calls onClick prop when card is clicked', () => {
        const handleClick = jest.fn();
        renderWithRedux(_jsx(CityCard, { city: mockCity, onClick: handleClick }));
        const card = screen.getByText('New York').closest('.city-card');
        if (card) {
            fireEvent.click(card);
            expect(handleClick).toHaveBeenCalledWith(mockCity);
        }
        else {
            fail('City card element not found');
        }
    });
    test('does not dispatch fetchWeatherForCity if status is not idle', () => {
        renderWithRedux(_jsx(CityCard, { city: mockCity }), {
            preloadedState: {
                weather: {
                    data: {},
                    hourlyForecast: {},
                    status: { '1': 'loading' },
                    errors: {},
                },
                cities: { items: [], status: 'idle', error: null },
            },
        });
        expect(fetchWeatherForCity).not.toHaveBeenCalled();
    });
});
