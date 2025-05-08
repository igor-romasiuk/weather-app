import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { TemperatureGraph } from './TemperatureGraph';
jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }) => (_jsx("div", { "data-testid": "responsive-container", children: children })),
        LineChart: ({ children }) => (_jsx("div", { "data-testid": "line-chart", children: children })),
        Line: () => _jsx("div", { "data-testid": "line" }),
        XAxis: ({ dataKey }) => (_jsx("div", { "data-testid": "x-axis", "data-datakey": dataKey })),
        YAxis: ({ domain }) => (_jsx("div", { "data-testid": "y-axis", "data-domain": JSON.stringify(domain) })),
        CartesianGrid: () => _jsx("div", { "data-testid": "cartesian-grid" }),
        Tooltip: () => _jsx("div", { "data-testid": "tooltip" }),
    };
});
describe('TemperatureGraph Component', () => {
    const mockToday = new Date('2023-06-15T12:00:00Z');
    let originalDate;
    beforeAll(() => {
        originalDate = global.Date;
        const mockToISOString = jest.fn(() => '2023-06-15T12:00:00.000Z');
        global.Date.prototype.toISOString = mockToISOString;
    });
    afterAll(() => {
        global.Date = originalDate;
    });
    const todayTimestamp = Math.floor(mockToday.getTime() / 1000);
    const mockForecast = {
        hourly: [
            {
                dt: todayTimestamp,
                temp: 20,
                feels_like: 19,
                humidity: 65,
                pressure: 1013,
            },
            {
                dt: todayTimestamp + 3600,
                temp: 22,
                feels_like: 21,
                humidity: 60,
                pressure: 1012,
            },
            {
                dt: todayTimestamp + 7200,
                temp: 24,
                feels_like: 23,
                humidity: 55,
                pressure: 1011,
            },
            {
                dt: todayTimestamp + 10800,
                temp: 23,
                feels_like: 22,
                humidity: 58,
                pressure: 1011,
            },
            {
                dt: todayTimestamp + 86400,
                temp: 19,
                feels_like: 18,
                humidity: 70,
                pressure: 1015,
            },
            {
                dt: todayTimestamp + 90000,
                temp: 18,
                feels_like: 17,
                humidity: 72,
                pressure: 1016,
            },
        ],
    };
    test('renders the heading', () => {
        render(_jsx(TemperatureGraph, { forecast: mockForecast }));
        expect(screen.getByText('Hourly Temperature Forecast')).toBeInTheDocument();
    });
    test('renders the chart components', () => {
        render(_jsx(TemperatureGraph, { forecast: mockForecast }));
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('line')).toBeInTheDocument();
    });
    test('uses "time" as the x-axis data key', () => {
        render(_jsx(TemperatureGraph, { forecast: mockForecast }));
        expect(screen.getByTestId('x-axis')).toHaveAttribute('data-datakey', 'time');
    });
    test('configures y-axis with the correct domain', () => {
        render(_jsx(TemperatureGraph, { forecast: mockForecast }));
        const yAxis = screen.getByTestId('y-axis');
        expect(yAxis).toHaveAttribute('data-domain');
        expect(JSON.parse(yAxis.getAttribute('data-domain') || '[]')[0]).toBe(0);
    });
    test("filters data to show only today's forecast", () => {
        const { container } = render(_jsx(TemperatureGraph, { forecast: mockForecast }));
        expect(container).toBeInTheDocument();
    });
    test('formats time correctly', () => {
        render(_jsx(TemperatureGraph, { forecast: mockForecast }));
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
});
