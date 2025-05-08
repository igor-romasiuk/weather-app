import { useMemo, useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    const hourlyData = forecast.hourly
      .filter((item) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === today;
      })
      .map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        temperature: Math.round(item.temp),
        timestamp: item.dt,
      }));

    if (isMobile) {
      return hourlyData.filter((_, index) => index % 2 === 0);
    }

    return hourlyData;
  }, [forecast, isMobile]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="temperature-graph__custom-tooltip">
          <p className="temperature-graph__time">{label}</p>
          <p className="temperature-graph__temp">
            Temperature: <span>{payload[0].value}°C</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="temperature-graph">
      <h3 className="temperature-graph__title">Today's Hourly Forecast</h3>
      <div className="temperature-graph__chart">
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: isMobile ? 10 : 30,
              left: isMobile ? 0 : 20,
              bottom: isMobile ? 0 : 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickMargin={isMobile ? 5 : 10}
              height={isMobile ? 20 : 30}
            />
            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              allowDataOverflow
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickMargin={isMobile ? 5 : 10}
              width={isMobile ? 25 : 35}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="temperature"
              name="Temperature"
              stroke="#3498db"
              strokeWidth={2}
              activeDot={{ r: isMobile ? 6 : 8 }}
              dot={{ r: isMobile ? 3 : 4 }}
              isAnimationActive={!isMobile}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
