const toredaConfig = require('@toreda/eslint-config');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
	{
		ignores: ['dist/**']
	},
	...toredaConfig,
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			ecmaVersion: 2020
		},
		rules: {
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/explicit-function-return-type': ['warn', {allowExpressions: true}],
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off'
		}
	},
	{
		files: ['src/types/global.d.ts'],
		rules: {
			'no-var': 'off',
			'@typescript-eslint/no-explicit-any': 'off'
		}
	}
];
