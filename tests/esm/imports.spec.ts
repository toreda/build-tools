import {esmImports} from '../../src/esm/imports';
import mockFs from 'mock-fs';

describe('esmImports', () => {
	beforeEach(() => {
		mockFs({
			'/out': {
				'config.js': '',
				'config.d.ts': '',
				'run.js': '',
				'build': {
					'index.js': ''
				}
			}
		});
	});

	afterEach(() => {
		mockFs.restore();
	});

	it(`should rewrite static imports`, () => {
		expect(esmImports(`import {Config} from './config';`, '/out', '.js')).toBe(
			`import {Config} from './config.js';`
		);
	});

	it(`should rewrite re-exports`, () => {
		expect(esmImports(`export {Run} from './run';`, '/out', '.js')).toBe(`export {Run} from './run.js';`);
		expect(esmImports(`export * from './build';`, '/out', '.js')).toBe(`export * from './build/index.js';`);
	});

	it(`should rewrite side effect imports`, () => {
		expect(esmImports(`import './run';`, '/out', '.js')).toBe(`import './run.js';`);
	});

	it(`should rewrite dynamic imports with literal specifiers`, () => {
		expect(esmImports(`const m = await import('./run');`, '/out', '.js')).toBe(
			`const m = await import('./run.js');`
		);
	});

	it(`should rewrite inline import types in declaration files`, () => {
		expect(esmImports(`cfg: import("./config").Config;`, '/out', '.d.ts')).toBe(
			`cfg: import("./config.js").Config;`
		);
	});

	it(`should preserve the quote style of each specifier`, () => {
		expect(esmImports(`import a from "./run";\nimport b from './config';`, '/out', '.js')).toBe(
			`import a from "./run.js";\nimport b from './config.js';`
		);
	});

	it(`should rewrite every specifier in multi-line contents`, () => {
		const contents = [`import {a} from './config';`, `import {b} from './run';`, `import {c} from './build';`];
		const expected = [
			`import {a} from './config.js';`,
			`import {b} from './run.js';`,
			`import {c} from './build/index.js';`
		];

		expect(esmImports(contents.join('\n'), '/out', '.js')).toBe(expected.join('\n'));
	});

	it(`should not change package imports`, () => {
		const contents = `import {src} from 'gulp';\nimport Path from 'path';`;

		expect(esmImports(contents, '/out', '.js')).toBe(contents);
	});

	it(`should not change matching string literals outside of import statements`, () => {
		const contents = `const path = './config';`;

		expect(esmImports(contents, '/out', '.js')).toBe(contents);
	});

	it(`should return contents unchanged when there are no imports`, () => {
		expect(esmImports(`export const a = 1;`, '/out', '.js')).toBe(`export const a = 1;`);
	});

	it(`should return non-string contents unchanged`, () => {
		expect(esmImports(null as any, '/out', '.js')).toBeNull();
	});

	it(`should pass options through to specifier resolution`, () => {
		mockFs({'/out': {'config.mjs': ''}});

		expect(esmImports(`import {a} from './config';`, '/out', '.mjs', {extMap: {'.mjs': '.mjs'}})).toBe(
			`import {a} from './config.mjs';`
		);
	});
});
