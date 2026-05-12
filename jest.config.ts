import type {Config} from 'jest';

const config: Config = {
	testEnvironment: 'node',
	roots: ['<rootDir>/tests'],
	testMatch: ['**/*.spec.ts'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	transform: {
		'^.+\\.tsx?$': '@swc/jest',
		'^.+\\.m?js$': '@swc/jest'
	},
	testResultsProcessor: 'jest-sonar-reporter',
	coverageDirectory: 'coverage',
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'/dist/',
		'/tests/',
		'/jest/',
		'/.node/',
		'gulpfile.ts',
		'webpack.config.ts'
	],
	coverageReporters: process.env.COVERAGE === 'full' ? ['text', 'text-summary', 'lcov'] : ['text-summary', 'lcov'],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 40,
			statements: 30
		}
	}
};

export default config;
