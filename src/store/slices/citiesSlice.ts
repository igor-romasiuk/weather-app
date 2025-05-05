import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { City, CityData } from '../../types/weather';
import { getCitiesByName, DEFAULT_CITIES } from '../../services/weatherService';

interface CitiesState {
  items: City[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CitiesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchCities = createAsyncThunk('cities/fetchCities', async () => {
  const citiesData = await Promise.all(
    DEFAULT_CITIES.map(async (cityName) => {
      const data = await getCitiesByName(cityName, 1);
      return data[0];
    })
  );

  const validCities = citiesData
    .filter((city): city is CityData => !!city)
    .map((city, index) => ({
      id: index + 1,
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
    }));

  return validCities;
});

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCities.fulfilled, (state, action: PayloadAction<City[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch cities';
      });
  },
});

export default citiesSlice.reducer;
