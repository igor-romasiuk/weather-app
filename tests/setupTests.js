import '@testing-library/jest-dom';
// Mock the weatherService module
jest.mock('../src/services/weatherService', () => require('../tests/mocks/weatherServiceMock'), {
    virtual: true,
});
