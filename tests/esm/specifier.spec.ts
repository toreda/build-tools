import {esmSpecifier} from '../../src/esm/specifier';
import mockFs from 'mock-fs';

describe('esmSpecifier', () => {
	beforeEach(() => {
		mockFs({
			'/out': {
				'config.js': '',
				'config.d.ts': '',
				'config': {
					'linter.js': ''
				},
				'build': {
					'index.js': '',
					'index.d.ts': ''
				},
				'data.json': '{}',
				'nested': {
					'file.js': ''
				}
			}
		});
	});

	afterEach(() => {
		mockFs.restore();
	});

	it(`should append '.js' when a matching file exists`, () => {
		expect(esmSpecifier('/out', './config/linter', '.js')).toBe('./config/linter.js');
	});

	it(`should prefer the file when a file and dir share the same name`, () => {
		expect(esmSpecifier('/out', './config', '.js')).toBe('./config.js');
	});

	it(`should append '/index.js' when specifier targets a dir with an index file`, () => {
		expect(esmSpecifier('/out', './build', '.js')).toBe('./build/index.js');
	});

	it(`should not produce a double slash when dir specifier has a trailing slash`, () => {
		expect(esmSpecifier('/out', './build/', '.js')).toBe('./build/index.js');
	});

	it(`should resolve parent dir specifiers`, () => {
		expect(esmSpecifier('/out/nested', '../config', '.js')).toBe('../config.js');
	});

	it(`should find targets using '.d.ts' but still append '.js' for declaration files`, () => {
		expect(esmSpecifier('/out', './config', '.d.ts')).toBe('./config.js');
		expect(esmSpecifier('/out', './build', '.d.ts')).toBe('./build/index.js');
	});

	it(`should not change declaration file specifiers when only the '.js' target exists`, () => {
		expect(esmSpecifier('/out', './nested/file', '.d.ts')).toBe('./nested/file');
	});

	it(`should return specifier unchanged when it already has an extension`, () => {
		expect(esmSpecifier('/out', './config.js', '.js')).toBe('./config.js');
		expect(esmSpecifier('/out', './data.json', '.js')).toBe('./data.json');
		expect(esmSpecifier('/out', './other.mjs', '.js')).toBe('./other.mjs');
		expect(esmSpecifier('/out', './other.cjs', '.js')).toBe('./other.cjs');
	});

	it(`should return specifier unchanged when no matching target exists`, () => {
		expect(esmSpecifier('/out', './missing', '.js')).toBe('./missing');
	});

	it(`should return package specifiers unchanged`, () => {
		expect(esmSpecifier('/out', 'gulp', '.js')).toBe('gulp');
		expect(esmSpecifier('/out', '@toreda/log', '.js')).toBe('@toreda/log');
		expect(esmSpecifier('/out', 'config', '.js')).toBe('config');
	});

	it(`should return non-string specifiers unchanged`, () => {
		expect(esmSpecifier('/out', undefined as any, '.js')).toBeUndefined();
	});

	describe('options', () => {
		beforeEach(() => {
			mockFs({
				'/out': {
					'config.mjs': '',
					'config.d.mts': '',
					'build': {
						'main.js': '',
						'index.mjs': ''
					},
					'styles.css': ''
				}
			});
		});

		it(`should append the extension mapped to file ext in extMap`, () => {
			const options = {extMap: {'.mjs': '.mjs', '.d.mts': '.mjs'}};

			expect(esmSpecifier('/out', './config', '.mjs', options)).toBe('./config.mjs');
			expect(esmSpecifier('/out', './config', '.d.mts', options)).toBe('./config.mjs');
			expect(esmSpecifier('/out', './build', '.mjs', options)).toBe('./build/index.mjs');
		});

		it(`should return specifier unchanged when file ext is not in extMap`, () => {
			expect(esmSpecifier('/out', './config', '.mjs')).toBe('./config');
			expect(esmSpecifier('/out', './config', '.js', {extMap: {'.mjs': '.mjs'}})).toBe('./config');
		});

		it(`should use indexName to resolve dir specifiers`, () => {
			expect(esmSpecifier('/out', './build', '.js', {indexName: 'main'})).toBe('./build/main.js');
		});

		it(`should return specifier unchanged when it ends in a custom resolved ext`, () => {
			expect(esmSpecifier('/out', './styles.css', '.js', {resolvedExts: ['.css']})).toBe('./styles.css');
		});

		it(`should replace default resolved exts when resolvedExts is provided`, () => {
			mockFs({'/out': {'data.json.js': ''}});

			expect(esmSpecifier('/out', './data.json', '.js', {resolvedExts: []})).toBe('./data.json.js');
		});
	});
});
