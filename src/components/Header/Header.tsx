import { Link } from 'react-router-dom';
import './Header.scss';

export const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          Weather App
        </Link>
        <nav className="header__nav">
          <Link to="/" className="header__nav-link">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
};
