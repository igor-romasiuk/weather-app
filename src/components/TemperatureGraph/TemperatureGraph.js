import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
import './TemperatureGraph.scss';
export const TemperatureGraph = ({ forecast }) => {
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
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (_jsxs("div", { className: "temperature-graph__custom-tooltip", children: [_jsx("p", { className: "temperature-graph__time", children: label }), _jsxs("p", { className: "temperature-graph__temp", children: ["Temperature: ", _jsxs("span", { children: [payload[0].value, "\u00B0C"] })] })] }));
        }
        return null;
    };
    return (_jsxs("div", { className: "temperature-graph", children: [_jsx("h3", { className: "temperature-graph__title", children: "Today's Hourly Forecast" }), _jsx("div", { className: "temperature-graph__chart", children: _jsx(ResponsiveContainer, { width: "100%", height: isMobile ? 220 : 300, children: _jsxs(LineChart, { data: data, margin: {
                            top: 10,
                            right: isMobile ? 10 : 30,
                            left: isMobile ? 0 : 20,
                            bottom: isMobile ? 0 : 5,
                        }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#eee" }), _jsx(XAxis, { dataKey: "time", tick: { fontSize: isMobile ? 10 : 12 }, tickMargin: isMobile ? 5 : 10, height: isMobile ? 20 : 30 }), _jsx(YAxis, { domain: ['dataMin - 2', 'dataMax + 2'], allowDataOverflow: true, tick: { fontSize: isMobile ? 10 : 12 }, tickMargin: isMobile ? 5 : 10, width: isMobile ? 25 : 35, tickFormatter: (value) => `${value}°` }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Line, { type: "monotone", dataKey: "temperature", name: "Temperature", stroke: "#3498db", strokeWidth: 2, activeDot: { r: isMobile ? 6 : 8 }, dot: { r: isMobile ? 3 : 4 }, isAnimationActive: !isMobile })] }) }) })] }));
};
