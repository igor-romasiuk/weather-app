import { jsx as _jsx } from "react/jsx-runtime";
import { render } from '@testing-library/react';
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
const rootReducer = (state = initialState) => {
    return state;
};
const createTestStore = (preloadedState) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState: preloadedState || initialState,
    });
};
export const renderWithRedux = (ui, options = {}) => {
    const { preloadedState, ...renderOptions } = options;
    const testStore = createTestStore(preloadedState);
    return {
        ...render(ui, {
            wrapper: ({ children }) => _jsx(Provider, { store: testStore, children: children }),
            ...renderOptions,
        }),
        store: testStore,
    };
};
