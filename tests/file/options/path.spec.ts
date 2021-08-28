import {FileOptions} from '../../../src/file/options';
import {filePath} from '../../../src/file/path';

describe('filePath', () => {
	it(`should return null when input arg is undefined`, () => {
		const result = filePath(undefined as any);
		expect(result).toBeNull();
	});

	it(`should return null when input arg is null`, () => {
		const result = filePath(null as any);
		expect(result).toBeNull();
	});

	it(`should return provided input when input arg is a string`, () => {
		const input = 'aaaaa.ts';
		const result = filePath(input);

		expect(result).toBe(input);
	});

	it(`should return null when input is an object with no path property`, () => {
		const input = {};
		const result = filePath(input as any);

		expect(result).toBeNull();
	});

	it(`should return null when input is an object but object.path is a truthy non-string`, () => {
		const input: FileOptions = {
			path: 111131 as any
		};

		const result = filePath(input);

		expect(result).toBeNull();
	});

	it(`should return path property from input object when object.path is a string`, () => {
		const input: FileOptions = {
			path: 'aaaaaa.ts'
		};
		const result = filePath(input);
		expect(result).toBe(input.path);
	});
});
