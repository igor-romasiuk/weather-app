import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CitySearch } from './CitySearch';
const mockDispatch = jest.fn();
jest.mock('../../App', () => ({
    useAppDispatch: () => mockDispatch,
}));
const mockSearchCity = jest.fn();
const mockSearchFulfilled = { match: jest.fn().mockReturnValue(true) };
const mockAddCity = jest.fn();
const mockAddCityFulfilled = { match: jest.fn().mockReturnValue(true) };
jest.mock('../../store/slices/citiesSlice', () => {
    return {
        searchCity: function searchCity() {
            return mockSearchCity;
        },
        addCity: function addCity() {
            return mockAddCity;
        },
    };
});
jest.mock('../../store/slices/weatherSlice', () => ({
    fetchWeatherForCity: jest.fn(),
}));
describe('CitySearch Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        mockDispatch.mockImplementation(() => Promise.resolve({
            type: 'cities/searchCity/fulfilled',
            payload: [],
        }));
        mockSearchCity.fulfilled = mockSearchFulfilled;
        mockAddCity.fulfilled = mockAddCityFulfilled;
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    test('renders search input correctly', () => {
        render(_jsx(CitySearch, {}));
        const input = screen.getByPlaceholderText('Search for a city...');
        expect(input).toBeInTheDocument();
    });
    test('updates input value when typed', () => {
        render(_jsx(CitySearch, {}));
        const input = screen.getByPlaceholderText('Search for a city...');
        act(() => {
            fireEvent.change(input, { target: { value: 'New York' } });
        });
        expect(input.value).toBe('New York');
    });
    test('dispatches search action after debounce', async () => {
        render(_jsx(CitySearch, {}));
        const input = screen.getByPlaceholderText('Search for a city...');
        act(() => {
            fireEvent.change(input, { target: { value: 'New' } });
        });
        expect(mockDispatch).not.toHaveBeenCalled();
        act(() => {
            jest.advanceTimersByTime(500);
        });
        expect(mockDispatch).toHaveBeenCalled();
        await act(async () => {
            await Promise.resolve();
        });
    });
});
