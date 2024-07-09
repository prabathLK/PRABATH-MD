module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  roots: ['<rootDir>'], // Update the test root
  collectCoverage: true,           // Enable coverage collection
  coverageDirectory: 'coverage',   // Directory for coverage reports
  collectCoverageFrom: ['src/**/*.ts'] // Source files to include in coverage
};
