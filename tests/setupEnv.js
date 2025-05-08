import { config } from 'dotenv';
export default async () => {
    // Load environment variables from .env file
    config();
    // Set up environment variables for tests
    process.env.VITE_OPENWEATHER_API_KEY = process.env.VITE_OPENWEATHER_API_KEY || 'mock-api-key';
    // Suppress Node.js punycode deprecation warnings
    process.env.NODE_NO_WARNINGS = '1';
};
