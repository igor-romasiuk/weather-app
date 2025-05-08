# Weather App

## Overview

A modern React weather application that allows users to search for cities and view current weather conditions and forecasts. Built with React, Redux Toolkit, and TypeScript.

## Features

- Search for cities by name
- View detailed weather information including temperature, conditions, and more
- Responsive design for both desktop and mobile devices
- Hourly weather forecasts
- Smooth page transitions with Framer Motion

## Tech Stack

- **Frontend**: React, TypeScript, SCSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **API**: OpenWeatherMap API
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Build Tool**: Vite
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- OpenWeatherMap API key

### Installation

1. Clone the repository

```
git clone https://github.com/igor-romasiuk/weather-app.git
cd weather-app
```

2. Install dependencies

```
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your OpenWeatherMap API key

```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server

```
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/         # Configuration files
├── helpers/        # Helper functions
├── pages/          # Application pages
│   ├── HomePage/   # Main city listing page
│   └── DetailPage/ # City weather detail page
├── services/       # API services
├── store/          # Redux store and slices
├── styles/         # Global styles
└── types/          # TypeScript type definitions
```
