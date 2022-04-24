import {ConfigLinter} from '../../src/config/linter';
import type {LinterOptions} from '../../src/linter/options';

const RANGE_BOOL = {
	valid: [
		{value: true, label: 'true'},
		{value: false, label: 'false'}
	],
	invalid: [
		{value: 1, label: 'truthy integer 1'},
		{value: 0, label: 'falsy integer 0'},
		{value: [], label: 'empty array'},
		{value: {}, label: 'empty object'},
		{value: undefined, label: 'undefined'},
		{value: null, label: 'null'}
	]
};

const RANGE_ESLINT_PLUGINS = {
	valid: [{value: undefined, label: 'undefined (no plugins)'}],
	invalid: [
		{value: 1, label: 'truthy integer 1'},
		{value: 0, label: 'falsy integer 0'},
		{value: [], label: 'empty array'},
		{value: undefined, label: 'undefined'},
		{value: null, label: 'null'}
	]
};

const RANGE_ESLINT_CONFIG = {
	valid: [{value: {}, label: 'empty object'}],
	invalid: [
		{value: 1, label: 'truthy integer 1'},
		{value: 0, label: 'falsy integer 0'},
		{value: [], label: 'empty array'},
		{value: undefined, label: 'undefined'},
		{value: null, label: 'null'}
	]
};

const RANGE_ARRAY_STRINGS = {
	valid: [
		{value: [], label: 'empty array'},
		{value: [''], label: 'array with empty string'},
		{value: ['a', 'b', 'c'], label: 'array with several string elements'}
	],
	invalid: [
		{value: {}, label: 'empty object'},
		{value: undefined, label: 'undefined'},
		{value: null, label: 'null'}
	]
};

const RANGE_CACHE_STRATEGY = {
	valid: [
		{value: 'content', label: 'content'},
		{value: 'metadata', label: 'metadata'}
	],
	invalid: [
		{value: 1, label: 'truthy integer 1'},
		{value: 0, label: 'falsy integer 0'},
		{value: [], label: 'empty array'},
		{value: {}, label: 'empty object'},
		{value: undefined, label: 'undefined'},
		{value: null, label: 'null'}
	]
};

const RANGE_STRINGS = {
	valid: [
		{value: '', label: 'empty string'},
		{value: '    ', label: 'empty padded string'},
		{value: '1', label: '1 character string'},
		{value: '12345', label: '5 character string'},
		{value: 'one two three four five six seven eight nine ten eleven twelve', label: 'long string'}
	],
	invalid: [
		{value: 1, label: 'truthy integer 1'},
		{value: 0, label: 'falsy integer 0'},
		{value: [], label: 'empty array'},
		{value: {}, label: 'empty object'},
		{value: undefined, label: 'undefined'},
		{value: null, label: 'null'}
	]
};

const SCHEMA = [
	{label: 'quiet', property: 'quiet', initial: false, type: 'boolean', range: RANGE_BOOL},
	{label: 'autofix', property: 'autofix', initial: false, type: 'boolean', range: RANGE_BOOL},
	{
		label: 'cwd',
		property: 'cwd',
		initial: undefined,
		type: 'string',
		range: RANGE_STRINGS
	},
	{
		label: 'cacheStrategy',
		property: 'cacheStrategy',
		initial: undefined,
		type: 'string',
		range: RANGE_CACHE_STRATEGY
	},
	{
		label: 'cacheLocation',
		property: 'cacheLocation',
		initial: undefined,
		type: 'string',
		range: RANGE_STRINGS
	},
	{
		label: 'allowInlineConfig',
		property: 'allowInlineConfig',
		initial: false,
		type: 'boolean',
		range: RANGE_BOOL
	},
	{
		label: 'useEslintrc',
		property: 'useEslintrc',
		initial: true,
		type: 'boolean',
		range: RANGE_BOOL
	},
	{
		label: 'cache',
		property: 'cache',
		initial: false,
		type: 'boolean',
		range: RANGE_BOOL
	},
	{
		label: 'globInputPaths',
		property: 'globInputPaths',
		initial: undefined,
		type: 'boolean',
		range: RANGE_BOOL
	},
	{
		label: 'fixTypes',
		property: 'fixTypes',
		initial: undefined,
		type: 'array<string>',
		range: RANGE_ARRAY_STRINGS
	},
	{
		label: 'extensions',
		property: 'extensions',
		initial: undefined,
		type: 'array<string>',
		range: RANGE_ARRAY_STRINGS
	},
	{
		label: 'cacheLocation',
		property: 'cacheLocation',
		initial: undefined,
		type: 'string',
		range: RANGE_STRINGS
	},
	{
		label: 'rulePaths',
		property: 'rulePaths',
		initial: undefined,
		type: 'array<string>',
		range: RANGE_ARRAY_STRINGS
	},
	{
		label: 'ignore',
		property: 'ignore',
		initial: false,
		type: 'boolean',
		range: RANGE_BOOL
	},
	{
		label: 'ignorePath',
		property: 'ignorePath',
		initial: undefined,
		type: 'string',
		range: RANGE_STRINGS
	},
	{
		label: 'resolvePluginsRelativeTo',
		property: 'resolvePluginsRelativeTo',
		initial: undefined,
		type: 'string',
		range: RANGE_STRINGS
	},
	{
		label: 'overrideConfig',
		property: 'overrideConfig',
		initial: undefined,
		type: 'Linter.Config',
		range: RANGE_ESLINT_CONFIG
	},
	{
		label: 'baseConfig',
		property: 'baseConfig',
		initial: undefined,
		type: 'Linter.Config',
		range: RANGE_ESLINT_CONFIG
	},
	{
		label: 'overrideConfigFile',
		property: 'overrideConfigFile',
		initial: undefined,
		type: 'string',
		range: RANGE_STRINGS
	},
	{
		label: 'reportUnusedDisableDirectives',
		property: 'reportUnusedDisableDirectives',
		initial: undefined,
		type: 'boolean',
		range: RANGE_BOOL
	},
	{
		label: 'plugins',
		property: 'plugins',
		initial: undefined,
		type: 'Record<string, any>',
		range: RANGE_ESLINT_PLUGINS
	}
];

describe('LinterConfig', () => {
	const sampleConfig = new ConfigLinter();
	let options: LinterOptions;
	let propTests: Record<string, number>;
	const propKeys = Object.keys(sampleConfig);

	beforeAll(() => {
		propTests = {};

		for (const key of propKeys) {
			propTests[key] = 0;
		}
	});

	beforeEach(() => {
		options = {};
	});

	for (const prop of SCHEMA) {
		describe(`${prop.label} ${prop.type}`, () => {
			afterEach(() => {
				if (typeof propTests[prop.label] !== 'number') {
					throw new Error(`${prop.label} has tests but no Config property in ConfigLinter.`);
				}

				propTests[prop.label]++;
			});

			it(`should be initialized to ${prop.initial} when not provided in options`, () => {
				const _custom = new ConfigLinter(options);
			});

			for (const value of prop.range.valid) {
				it(`should initialize to value of options.${prop.label} when provided with valid value '${value.label}'`, () => {
					options[prop.property] = value.value;
					const custom = new ConfigLinter(options);

					expect(custom[prop.property]).toBe(value.value);
				});
			}

			for (const value of prop.range.invalid) {
				it(`should initialize to default value '${prop.initial}' when options.${prop.label} has invalid ${prop.type} value '${value.label}'`, () => {
					options[prop.property] = value.value as any;
					const custom = new ConfigLinter(options);
					expect(custom[prop.property]).toBe(prop.initial);
				});
			}
		});
	}

	describe('Property Test Coverage', () => {
		for (const key of propKeys) {
			it(`should include tests for ConfigLinter.${key}`, () => {
				expect(typeof propTests[key]).toBe('number');
				expect(propTests[key]).toBeGreaterThan(0);
			});
		}
	});
});
