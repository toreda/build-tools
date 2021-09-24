module.exports = {
	roots: ['./'],
	coverageDirectory: './coverage',
	coveragePathIgnorePatterns: [
		'tests/',
		'node_modules/',
		'.node/',
		'jest/',
		'gulpfile.ts',
		'coverage/',
		'webpack.config.ts',
		'.github',
		'docs'
	],
	moduleFileExtensions: ['ts', 'js', 'json'],
	moduleNameMapper: {'^src/(.*)': '<rootDir>/src/$1'},
	testEnvironment: 'node',
	testPathIgnorePatterns: ['node_modules'],
	testRegex: '(/__tests__/.*|(\\.|/)(spec))\\.ts$',
	testResultsProcessor: 'jest-sonar-reporter',
	transform: {'^.+\\.tsx?$': 'ts-jest', '^.+\\.jsx?$': 'babel-jest'},
	transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!core-js/)|(?!deck.gl)|ng-dynamic)']
};
