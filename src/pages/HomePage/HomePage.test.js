import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomePage } from './HomePage';
import { MemoryRouter } from 'react-router-dom';
import { routerConfig } from '../../config/routerConfig';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));
jest.mock('../../components/CitySearch/CitySearch', () => ({
    CitySearch: () => _jsx("div", { "data-testid": "city-search", children: "City Search Component" }),
}));
jest.mock('../../components/CityList/CityList', () => ({
    CityList: ({ cities, onCityClick }) => (_jsx("div", { "data-testid": "city-list", children: cities.map((city) => (_jsx("button", { onClick: () => onCityClick(city), "data-testid": `city-${city.id}`, children: city.name }, city.id))) })),
}));
jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));
describe('HomePage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const renderHomePage = (reduxState = {}) => {
        const useSelector = jest.requireMock('react-redux').useSelector;
        useSelector.mockImplementation((selector) => selector(reduxState));
        return render(_jsx(MemoryRouter, { ...routerConfig, children: _jsx(HomePage, {}) }));
    };
    test('renders title and search component', () => {
        renderHomePage({
            cities: { items: [], status: 'idle', error: null },
        });
        expect(screen.getByText('Weather App')).toBeInTheDocument();
        expect(screen.getByText('Add New City')).toBeInTheDocument();
        expect(screen.getByTestId('city-search')).toBeInTheDocument();
    });
    test('displays loading message when status is loading', () => {
        renderHomePage({
            cities: { items: [], status: 'loading', error: null },
        });
        expect(screen.getByText('Loading cities...')).toBeInTheDocument();
    });
    test('displays error message when status is failed', () => {
        renderHomePage({
            cities: { items: [], status: 'failed', error: 'Failed to load cities' },
        });
        expect(screen.getByText('Failed to load cities')).toBeInTheDocument();
    });
    test('displays empty state message when no cities', () => {
        renderHomePage({
            cities: { items: [], status: 'succeeded', error: null },
        });
        expect(screen.getByText('No cities added yet. Search for a city above to add it to your list.')).toBeInTheDocument();
    });
    test('renders city list when cities are available', () => {
        const mockCities = [
            { id: 1, name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
            { id: 2, name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
        ];
        renderHomePage({
            cities: { items: mockCities, status: 'succeeded', error: null },
        });
        expect(screen.getByTestId('city-list')).toBeInTheDocument();
        expect(screen.getByText('London')).toBeInTheDocument();
        expect(screen.getByText('Paris')).toBeInTheDocument();
    });
    test('navigates to city detail page when city is clicked', async () => {
        const mockCities = [
            { id: 1, name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
        ];
        renderHomePage({
            cities: { items: mockCities, status: 'succeeded', error: null },
        });
        const user = userEvent.setup();
        await user.click(screen.getByTestId('city-1'));
        expect(mockNavigate).toHaveBeenCalledWith('/city/1');
    });
});
