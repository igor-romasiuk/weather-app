import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WeatherData } from '../../types/weather';
import { getWeatherByCoordinates } from '../../services/weatherService';

interface WeatherState {
  data: Record<string, WeatherData>;
  status: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>;
  errors: Record<string, string | null>;
}

const initialState: WeatherState = {
  data: {},
  status: {},
  errors: {},
};

export const fetchWeatherForCity = createAsyncThunk(
  'weather/fetchForCity',
  async ({ cityId, lat, lon }: { cityId: number; lat: number; lon: number }) => {
    const data = await getWeatherByCoordinates(lat, lon);
    return { cityId, data };
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherForCity.pending, (state, action) => {
        const cityId = action.meta.arg.cityId.toString();
        state.status[cityId] = 'loading';
      })
      .addCase(
        fetchWeatherForCity.fulfilled,
        (state, action: PayloadAction<{ cityId: number; data: WeatherData }>) => {
          const cityId = action.payload.cityId.toString();
          state.status[cityId] = 'succeeded';
          state.data[cityId] = action.payload.data;
          state.errors[cityId] = null;
        }
      )
      .addCase(fetchWeatherForCity.rejected, (state, action) => {
        const cityId = action.meta.arg.cityId.toString();
        state.status[cityId] = 'failed';
        state.errors[cityId] = action.error.message || 'Failed to fetch weather data';
      });
  },
});

export default weatherSlice.reducer;
