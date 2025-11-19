// NO EDITAR: Este archivo será renombrado a jest.config.cjs para evitar el error "module is not defined" con Node.js ESM.

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
    '^lucide-react$': '<rootDir>/node_modules/lucide-react/dist/cjs/lucide-react.js',
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
      useESM: false,
    }],
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/web-home/',
  ],
};