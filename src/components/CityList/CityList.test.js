import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import { CityList } from './CityList';
import { CityCard } from '../CityCard/CityCard';
jest.mock('../CityCard/CityCard', () => ({
    CityCard: jest.fn(({ city, onClick }) => (_jsx("div", { "data-testid": `city-card-${city.id}`, className: "city-card-mock", onClick: () => onClick && onClick(city), children: city.name }))),
}));
describe('CityList Component', () => {
    const mockCities = [
        { id: 1, name: 'New York', lat: 40.7128, lon: -74.006, country: 'US', state: 'NY' },
        { id: 2, name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB', state: 'England' },
        { id: 3, name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'JP', state: '' },
    ];
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('renders empty list when no cities are provided', () => {
        const { container } = render(_jsx(CityList, { cities: [] }));
        const cityListElement = container.querySelector('.city-list');
        expect(cityListElement).toBeInTheDocument();
        expect(cityListElement?.children.length).toBe(0);
    });
    test('renders a CityCard for each city', () => {
        render(_jsx(CityList, { cities: mockCities }));
        expect(CityCard).toHaveBeenCalledTimes(3);
        expect(screen.getByText('New York')).toBeInTheDocument();
        expect(screen.getByText('London')).toBeInTheDocument();
        expect(screen.getByText('Tokyo')).toBeInTheDocument();
    });
    test('passes the onCityClick prop to each CityCard', () => {
        const handleCityClick = jest.fn();
        render(_jsx(CityList, { cities: mockCities, onCityClick: handleCityClick }));
        mockCities.forEach((city) => {
            expect(CityCard).toHaveBeenCalledWith({ city, onClick: handleCityClick }, expect.anything());
        });
    });
    test('clicking on a CityCard triggers the onCityClick callback', () => {
        const handleCityClick = jest.fn();
        render(_jsx(CityList, { cities: mockCities, onCityClick: handleCityClick }));
        fireEvent.click(screen.getByText('London'));
        expect(handleCityClick).toHaveBeenCalledTimes(1);
        expect(handleCityClick).toHaveBeenCalledWith(mockCities[1]);
    });
});
