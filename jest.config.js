module.exports = {
  rootDir: './',
  testEnvironment: 'node',
  verbose: true,
  bail: false,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  coverageReporters: ['lcov'],
  coverageDirectory: '<rootDir>/coverage',
}
