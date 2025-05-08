import { WeatherDetail } from '../../components/WeatherDetail/WeatherDetail';
import { PageTransition } from '../../components/PageTransition/PageTransition';
import './DetailPage.scss';

export const DetailPage = () => {
  return (
    <PageTransition>
      <div className="detail-page">
        <header className="detail-page__header">
          <h1 className="detail-page__header-title">
            <span role="img" aria-label="weather">
              🌤️
            </span>{' '}
            Weather Details
          </h1>
        </header>

        <WeatherDetail />
      </div>
    </PageTransition>
  );
};
