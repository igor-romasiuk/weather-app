export const loadCitiesFromStorage = () => {
    try {
        const storedCities = localStorage.getItem('savedCities');
        if (storedCities) {
            return JSON.parse(storedCities);
        }
    }
    catch (error) {
        console.error('Failed to load cities from localStorage:', error);
    }
    return [];
};
export const saveCitiesToStorage = (cities) => {
    try {
        localStorage.setItem('savedCities', JSON.stringify(cities));
    }
    catch (error) {
        console.error('Failed to save cities to localStorage:', error);
    }
};
