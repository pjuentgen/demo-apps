import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: 'coverage',

  coveragePathIgnorePatterns: ['/node_modules/'],

  coverageProvider: 'v8',

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};

export default config;
