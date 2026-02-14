module.exports = {
  preset: './node_modules/ts-jest/jest-preset.js',
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
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  cacheDirectory: '.jest-cache',
  maxWorkers: '50%',
};
