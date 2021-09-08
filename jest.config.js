module.exports = {
	roots: ['./'],
	coverageDirectory: './coverage',
	coveragePathIgnorePatterns: [
		'.node/',
		'coverage/',
		'gulpfile.ts',
		'jest/',
		'node_modules/',
		'tests/',
		'webpack.config.js',
		'webpack.dev.js',
		'webpack.prod.js'
	],
	moduleFileExtensions: ['ts', 'js', 'json'],
	moduleNameMapper: {'^src/(.*)': '<rootDir>/src/$1'},
	testEnvironment: 'jsdom',
	testPathIgnorePatterns: ['node_modules'],
	testRegex: '(/__tests__/.*|(\\.|/)(spec))\\.ts$',
	testResultsProcessor: 'jest-sonar-reporter',
	transform: {'^.+\\.tsx?$': 'ts-jest', '^.+\\.jsx?$': 'babel-jest'},
	transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)']
};
