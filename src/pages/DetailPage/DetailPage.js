import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WeatherDetail } from '../../components/WeatherDetail/WeatherDetail';
import { PageTransition } from '../../components/PageTransition/PageTransition';
import './DetailPage.scss';
export const DetailPage = () => {
    return (_jsx(PageTransition, { children: _jsxs("div", { className: "detail-page", children: [_jsx("header", { className: "detail-page__header", children: _jsxs("h1", { className: "detail-page__header-title", children: [_jsx("span", { role: "img", "aria-label": "weather", children: "\uD83C\uDF24\uFE0F" }), ' ', "Weather Details"] }) }), _jsx(WeatherDetail, {})] }) }));
};
