module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: false,
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@aigestion/nexus-shared$': '<rootDir>/../packages/nexus-shared/src',
    '^googleapis$': '<rootDir>/src/__test_utils__/mocks/googleapis.ts',
    '^@googlemaps/google-maps-services-js$': '<rootDir>/src/__test_utils__/mocks/google-maps.ts',
  },
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  cacheDirectory: '.jest-cache',
  maxWorkers: 1, // Prevent worker crashes on Windows
  // Ignore mock utils to prevent them being run as tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/src/__test_utils__/'],
  transformIgnorePatterns: ['node_modules/(?!(mastra|llamaindex|googleapis)/)'],
};
