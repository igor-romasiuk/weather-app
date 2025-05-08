import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWeatherByCoordinates, getHourlyForecast } from '../../services/weatherService';
const initialState = {
    data: {},
    hourlyForecast: {},
    status: {},
    errors: {},
};
export const fetchWeatherForCity = createAsyncThunk('weather/fetchForCity', async ({ cityId, lat, lon }) => {
    const [weatherData, hourlyData] = await Promise.all([
        getWeatherByCoordinates(lat, lon),
        getHourlyForecast(lat, lon),
    ]);
    return { cityId, data: weatherData, hourlyForecast: hourlyData };
});
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
            .addCase(fetchWeatherForCity.fulfilled, (state, action) => {
            const cityId = action.payload.cityId.toString();
            state.status[cityId] = 'succeeded';
            state.data[cityId] = action.payload.data;
            state.hourlyForecast[cityId] = action.payload.hourlyForecast;
            state.errors[cityId] = null;
        })
            .addCase(fetchWeatherForCity.rejected, (state, action) => {
            const cityId = action.meta.arg.cityId.toString();
            state.status[cityId] = 'failed';
            state.errors[cityId] = action.error.message || 'Failed to fetch weather data';
        });
    },
});
export default weatherSlice.reducer;
