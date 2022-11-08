module.exports = {
  // collectCoverage: true,
  // collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  // coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  roots: ['<rootDir>/']
}
