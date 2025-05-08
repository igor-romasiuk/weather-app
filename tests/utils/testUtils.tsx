import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  weather: {
    data: {},
    hourlyForecast: {},
    status: {},
    errors: {},
  },
  cities: {
    items: [],
    status: 'idle',
    error: null,
  },
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
}

const rootReducer = (state = initialState) => {
  return state;
};

const createTestStore = (preloadedState?: any) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState || initialState,
  });
};

export const renderWithRedux = (ui: ReactElement, options: ExtendedRenderOptions = {}) => {
  const { preloadedState, ...renderOptions } = options;
  const testStore = createTestStore(preloadedState);

  return {
    ...render(ui, {
      wrapper: ({ children }) => <Provider store={testStore}>{children}</Provider>,
      ...renderOptions,
    }),
    store: testStore,
  };
};
