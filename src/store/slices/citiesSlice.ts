import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { City, CityData } from '../../types/weather';
import type { CitiesState } from '../../types/citiesState';
import { getCitiesByName, DEFAULT_CITIES } from '../../services/weatherService';
import { loadCitiesFromStorage, saveCitiesToStorage } from '../../helpers/citiesStorage';

const initialState: CitiesState = {
  items: loadCitiesFromStorage(),
  status: 'idle',
  error: null,
};

export const fetchCities = createAsyncThunk('cities/fetchCities', async (_, { getState }) => {
  const state = getState() as { cities: CitiesState };

  if (state.cities.items.length > 0) {
    return state.cities.items;
  }

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

  saveCitiesToStorage(validCities);

  return validCities;
});

export const searchCity = createAsyncThunk('cities/searchCity', async (cityName: string) => {
  const data = await getCitiesByName(cityName, 5);
  return data.map((city, index) => ({
    id: Date.now() + index,
    name: city.name,
    country: city.country,
    state: city.state,
    lat: city.lat,
    lon: city.lon,
  }));
});

export const addCity = createAsyncThunk('cities/addCity', async (city: City, { getState }) => {
  const state = getState() as { cities: CitiesState };

  const cityExists = state.cities.items.some(
    (c) => c.name === city.name && c.country === city.country
  );

  if (cityExists) {
    throw new Error(`${city.name} is already in your list`);
  }

  return city;
});

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    removeCity: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((city) => city.id !== action.payload);
      saveCitiesToStorage(state.items);
    },
  },
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
      })
      .addCase(searchCity.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(addCity.fulfilled, (state, action: PayloadAction<City>) => {
        state.items.push(action.payload);
        saveCitiesToStorage(state.items);
        state.error = null;
      })
      .addCase(addCity.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add city';
      });
  },
});

export const { removeCity } = citiesSlice.actions;
export default citiesSlice.reducer;
