import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './styles/main.scss';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
