import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { DetailPage } from './DetailPage';
jest.mock('../../components/WeatherDetail/WeatherDetail', () => ({
    WeatherDetail: () => _jsx("div", { "data-testid": "weather-detail", children: "Weather Detail Component" }),
}));
describe('DetailPage Component', () => {
    test('renders the DetailPage component', () => {
        render(_jsx(DetailPage, {}));
        const detailPage = screen.getByTestId('weather-detail').closest('.detail-page');
        expect(detailPage).toBeInTheDocument();
    });
    test('contains the WeatherDetail component', () => {
        render(_jsx(DetailPage, {}));
        const weatherDetail = screen.getByTestId('weather-detail');
        expect(weatherDetail).toBeInTheDocument();
    });
});
