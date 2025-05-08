import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'fs';

const tsConfig = JSON.parse(readFileSync('./tsconfig.test.json').toString());

const config: Config = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^.+\\.svg': '<rootDir>/tests/mocks/svgMock.tsx',
    '^import.meta$': '<rootDir>/tests/mocks/importMetaMock.ts',
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths || {}),
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        useESM: true,
        diagnostics: {
          ignoreCodes: [1343],
        },
      },
    ],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globalSetup: '<rootDir>/tests/setupEnv.ts',
  // Suppress specific console messages
  silent: false,
  // Set to true to suppress console.* outputs
  // silent: true,
  testPathIgnorePatterns: ['/node_modules/'],
};

export default config;
