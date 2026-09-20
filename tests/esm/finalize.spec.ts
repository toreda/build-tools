import {cjsFinalize, esmFinalize} from '../../src/esm/finalize';
import mockFs from 'mock-fs';
import {existsSync, readFileSync} from 'fs';

describe('esmFinalize', () => {
	beforeEach(() => {
		mockFs({
			'/dist/esm': {
				'index.js': `export {Config} from './config';\nexport {Linter} from './linter/target';`,
				'index.d.ts': `export {Config} from './config';`,
				'index.js.map': `{"sources":["./config"]}`,
				'config.js': `export class Config {}`,
				'config.d.ts': `export declare class Config {}`,
				'linter': {
					'target.js': `import {Config} from '../config';`
				}
			},
			'/dist/cjs': {
				'index.js': `const config_1 = require('./config');`
			}
		});
	});

	afterEach(() => {
		mockFs.restore();
	});

	it(`should rewrite specifiers in '.js' files`, async () => {
		await esmFinalize('/dist/esm', '/dist/cjs');

		expect(readFileSync('/dist/esm/index.js', 'utf8')).toBe(
			`export {Config} from './config.js';\nexport {Linter} from './linter/target.js';`
		);
	});

	it(`should rewrite specifiers in '.d.ts' files`, async () => {
		await esmFinalize('/dist/esm', '/dist/cjs');

		expect(readFileSync('/dist/esm/index.d.ts', 'utf8')).toBe(`export {Config} from './config.js';`);
	});

	it(`should rewrite specifiers in nested dirs`, async () => {
		await esmFinalize('/dist/esm', '/dist/cjs');

		expect(readFileSync('/dist/esm/linter/target.js', 'utf8')).toBe(`import {Config} from '../config.js';`);
	});

	it(`should not change files that are not '.js' or '.d.ts'`, async () => {
		await esmFinalize('/dist/esm', '/dist/cjs');

		expect(readFileSync('/dist/esm/index.js.map', 'utf8')).toBe(`{"sources":["./config"]}`);
	});

	it(`should not change CJS output files`, async () => {
		await esmFinalize('/dist/esm', '/dist/cjs');

		expect(readFileSync('/dist/cjs/index.js', 'utf8')).toBe(`const config_1 = require('./config');`);
	});

	it(`should write package.json with type 'module' to ESM dir`, async () => {
		await esmFinalize('/dist/esm', '/dist/cjs');

		expect(JSON.parse(readFileSync('/dist/esm/package.json', 'utf8'))).toStrictEqual({type: 'module'});
	});

	it(`should write package.json with type 'commonjs' to CJS dir`, async () => {
		await esmFinalize('/dist/esm', '/dist/cjs');

		expect(JSON.parse(readFileSync('/dist/cjs/package.json', 'utf8'))).toStrictEqual({type: 'commonjs'});
	});

	it(`should reject when ESM dir does not exist`, async () => {
		await expect(esmFinalize('/dist/missing', '/dist/cjs')).rejects.toThrow();
	});

	describe('options', () => {
		it(`should not rewrite specifiers when rewriteImports is false`, async () => {
			await esmFinalize('/dist/esm', '/dist/cjs', {rewriteImports: false});

			expect(readFileSync('/dist/esm/index.d.ts', 'utf8')).toBe(`export {Config} from './config';`);
			expect(existsSync('/dist/esm/package.json')).toBe(true);
		});

		it(`should not write package.json files when packageTypes is false`, async () => {
			await esmFinalize('/dist/esm', '/dist/cjs', {packageTypes: false});

			expect(existsSync('/dist/esm/package.json')).toBe(false);
			expect(existsSync('/dist/cjs/package.json')).toBe(false);
			expect(readFileSync('/dist/esm/index.d.ts', 'utf8')).toBe(`export {Config} from './config.js';`);
		});

		it(`should only write ESM package.json when cjsDir is not provided`, async () => {
			await esmFinalize('/dist/esm', null);

			expect(existsSync('/dist/esm/package.json')).toBe(true);
			expect(existsSync('/dist/cjs/package.json')).toBe(false);
		});

		it(`should only rewrite file types in extMap`, async () => {
			await esmFinalize('/dist/esm', '/dist/cjs', {extMap: {'.js': '.js'}});

			expect(readFileSync('/dist/esm/linter/target.js', 'utf8')).toBe(`import {Config} from '../config.js';`);
			expect(readFileSync('/dist/esm/index.d.ts', 'utf8')).toBe(`export {Config} from './config';`);
		});
	});

	describe('cjsFinalize', () => {
		it(`should write package.json with type 'commonjs' to CJS dir`, async () => {
			await cjsFinalize('/dist/cjs');

			expect(JSON.parse(readFileSync('/dist/cjs/package.json', 'utf8'))).toStrictEqual({type: 'commonjs'});
		});

		it(`should not write package.json when packageTypes is false`, async () => {
			await cjsFinalize('/dist/cjs', {packageTypes: false});

			expect(existsSync('/dist/cjs/package.json')).toBe(false);
		});
	});
});
