import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: { module: 'commonjs' } }] },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/prisma/seed.ts',
  ],
  coverageThresholds: {
    global: { branches: 60, functions: 60, lines: 60, statements: 60 },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterFramework: [],
  clearMocks: true,
};

export default config;
