import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HourlyForecast } from '../../types/weather';
import './TemperatureGraph.scss';

interface TemperatureGraphProps {
  forecast: HourlyForecast;
}

export const TemperatureGraph = ({ forecast }: TemperatureGraphProps) => {
  const data = useMemo(() => {
    return forecast.list.map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round(item.main.temp),
    }));
  }, [forecast]);

  return (
    <div className="temperature-graph">
      <h3>Hourly Temperature Forecast</h3>
      <div className="temperature-graph__chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              label={{ fill: '#666', fontSize: 12 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
