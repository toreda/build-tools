import {transpileFormats} from '../../src/transpile/formats';

describe('transpileFormats', () => {
	it(`should return all supported format keys`, () => {
		expect(transpileFormats()).toStrictEqual(['cjs', 'esm']);
	});

	it(`should return a new array each call so callers cannot change supported formats`, () => {
		const formats = transpileFormats();
		formats.pop();

		expect(transpileFormats()).toStrictEqual(['cjs', 'esm']);
	});
});
