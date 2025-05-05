import { configureStore } from '@reduxjs/toolkit';
import citiesReducer from './slices/citiesSlice';
import weatherReducer from './slices/weatherSlice';

export const store = configureStore({
  reducer: {
    cities: citiesReducer,
    weather: weatherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
