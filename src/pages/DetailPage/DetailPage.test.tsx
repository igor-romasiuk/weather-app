import { render, screen } from '@testing-library/react';
import { DetailPage } from './DetailPage';

jest.mock('../../components/WeatherDetail/WeatherDetail', () => ({
  WeatherDetail: () => <div data-testid="weather-detail">Weather Detail Component</div>,
}));

describe('DetailPage Component', () => {
  test('renders the DetailPage component', () => {
    render(<DetailPage />);

    const detailPage = screen.getByTestId('weather-detail').closest('.detail-page');
    expect(detailPage).toBeInTheDocument();
  });

  test('contains the WeatherDetail component', () => {
    render(<DetailPage />);

    const weatherDetail = screen.getByTestId('weather-detail');
    expect(weatherDetail).toBeInTheDocument();
  });
});
