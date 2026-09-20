import {cjsFinalize, esmFinalize} from '../../src/esm/finalize';

import {Clean} from '../../src/clean';
import {Create} from '../../src/create';
import {GulpSteps} from '../../src/gulp/steps';
import {Linter} from '../../src/linter';
import {Log} from '@toreda/log';
import Path from 'path';
import {Run} from '../../src/run';
import {Writable} from 'stream';
import mockFs from 'mock-fs';
import {transpileFormats} from '../../src/transpile/formats';

jest.mock('../../src/esm/finalize', () => ({
	cjsFinalize: jest.fn(async () => {}),
	esmFinalize: jest.fn(async () => {})
}));

function finishedStream(): NodeJS.ReadWriteStream {
	const stream = new Writable({
		write: (_chunk, _encoding, callback) => callback()
	});
	stream.end();

	return stream as unknown as NodeJS.ReadWriteStream;
}

describe('GulpSteps', () => {
	let instance: GulpSteps;
	let typescript: jest.Mock;
	let declarations: jest.Mock;

	const cjsDir = Path.join('./dist', 'cjs');
	const esmDir = Path.join('./dist', 'esm');

	beforeEach(() => {
		typescript = jest.fn(() => finishedStream());
		declarations = jest.fn(async () => {});

		const run = {typescript, declarations} as unknown as Run;
		instance = new GulpSteps(run, {} as Create, {} as Linter, {} as Clean, new Log());

		(esmFinalize as jest.Mock).mockClear();
		(cjsFinalize as jest.Mock).mockClear();
	});

	afterEach(() => {
		mockFs.restore();
	});

	describe('transpile', () => {
		let cjsSpy: jest.SpyInstance;
		let esmSpy: jest.SpyInstance;

		beforeEach(() => {
			cjsSpy = jest.spyOn(instance, 'transpileCjs').mockResolvedValue(finishedStream());
			esmSpy = jest.spyOn(instance, 'transpileEsm').mockResolvedValue(finishedStream());
		});

		it(`should call the step matching each format key`, async () => {
			await instance.transpile(['cjs', 'esm']);

			expect(cjsSpy).toHaveBeenCalledTimes(1);
			expect(esmSpy).toHaveBeenCalledTimes(1);
		});

		it(`should only call steps for provided format keys`, async () => {
			await instance.transpile(['esm']);

			expect(cjsSpy).not.toHaveBeenCalled();
			expect(esmSpy).toHaveBeenCalledTimes(1);
		});

		it(`should call steps in the order format keys are provided`, async () => {
			const order: string[] = [];
			cjsSpy.mockImplementation(async () => order.push('cjs'));
			esmSpy.mockImplementation(async () => order.push('esm'));

			await instance.transpile(['esm', 'cjs']);

			expect(order).toStrictEqual(['esm', 'cjs']);
		});

		it(`should only call a step once when format key is duplicated`, async () => {
			await instance.transpile(['esm', 'esm', 'cjs', 'esm']);

			expect(esmSpy).toHaveBeenCalledTimes(1);
			expect(cjsSpy).toHaveBeenCalledTimes(1);
		});

		it(`should pass options to each step`, async () => {
			const options = {outDir: './build'};
			await instance.transpile(['cjs', 'esm'], options);

			expect(cjsSpy).toHaveBeenCalledWith(options);
			expect(esmSpy).toHaveBeenCalledWith(options);
		});

		it(`should throw when formats is an empty array`, async () => {
			await expect(instance.transpile([])).rejects.toThrow('non-empty array');
		});

		it(`should throw when formats is not an array`, async () => {
			await expect(instance.transpile('esm' as any)).rejects.toThrow('non-empty array');
			await expect(instance.transpile(undefined as any)).rejects.toThrow('non-empty array');
		});

		it(`should throw on unsupported format keys before calling any step`, async () => {
			await expect(instance.transpile(['cjs', 'umd' as any])).rejects.toThrow(`unsupported format 'umd'`);

			expect(cjsSpy).not.toHaveBeenCalled();
		});

		it(`should not treat inherited object properties as format keys`, async () => {
			await expect(instance.transpile(['toString' as any])).rejects.toThrow('unsupported format');
		});
	});

	describe('transpileAll', () => {
		it(`should call transpile with every supported format`, async () => {
			const spy = jest.spyOn(instance, 'transpile').mockResolvedValue(finishedStream());
			const options = {outDir: './build'};

			await instance.transpileAll(options);

			expect(spy).toHaveBeenCalledWith(transpileFormats(), options);
		});

		it(`should build and finalize both CJS and ESM output`, async () => {
			await instance.transpileAll({declarationComments: false});

			expect(typescript).toHaveBeenCalledTimes(2);
			expect(typescript.mock.calls[0][0]).toBe(cjsDir);
			expect(typescript.mock.calls[1][0]).toBe(esmDir);
			expect(cjsFinalize).toHaveBeenCalledWith(cjsDir, undefined);
			expect(esmFinalize).toHaveBeenCalledWith(esmDir, null, undefined);
		});
	});

	describe('transpileCjs', () => {
		it(`should build to './dist/cjs' using './tsconfig.json' with module 'commonjs'`, async () => {
			await instance.transpileCjs({declarationComments: false});

			expect(typescript).toHaveBeenCalledTimes(1);
			expect(typescript).toHaveBeenCalledWith(cjsDir, './tsconfig.json', {module: 'commonjs'}, undefined);
		});

		it(`should finalize CJS output only`, async () => {
			await instance.transpileCjs({declarationComments: false});

			expect(cjsFinalize).toHaveBeenCalledWith(cjsDir, undefined);
			expect(esmFinalize).not.toHaveBeenCalled();
		});

		it(`should use cjsTsConfigPath without overriding module`, async () => {
			await instance.transpileCjs({cjsTsConfigPath: 'tsconfig.cjs.json', declarationComments: false});

			expect(typescript).toHaveBeenCalledWith(cjsDir, 'tsconfig.cjs.json', {}, undefined);
		});

		it(`should use cjsModule as module override`, async () => {
			await instance.transpileCjs({cjsModule: 'node16', declarationComments: false});

			expect(typescript).toHaveBeenCalledWith(cjsDir, './tsconfig.json', {module: 'node16'}, undefined);
		});

		it(`should apply cjsCompilerOptions after cjsModule and pass srcPatterns`, async () => {
			await instance.transpileCjs({
				cjsCompilerOptions: {target: 'es2018'},
				srcPatterns: ['./lib/**/*.ts'],
				declarationComments: false
			});

			expect(typescript).toHaveBeenCalledWith(
				cjsDir,
				'./tsconfig.json',
				{module: 'commonjs', target: 'es2018'},
				['./lib/**/*.ts']
			);
		});

		it(`should not use ESM options`, async () => {
			await instance.transpileCjs({
				esmTsConfigPath: 'tsconfig.esm.json',
				esmDirName: 'module',
				esmCompilerOptions: {target: 'es2022'},
				declarationComments: false
			});

			expect(typescript).toHaveBeenCalledWith(cjsDir, './tsconfig.json', {module: 'commonjs'}, undefined);
		});

		it(`should use custom outDir and cjsDirName`, async () => {
			await instance.transpileCjs({outDir: './build', cjsDirName: 'node', declarationComments: false});

			expect(typescript.mock.calls[0][0]).toBe(Path.join('./build', 'node'));
		});

		it(`should write output directly to outDir when cjsDirName is an empty string`, async () => {
			await instance.transpileCjs({outDir: './lib', cjsDirName: '', declarationComments: false});

			expect(typescript.mock.calls[0][0]).toBe(Path.join('./lib', ''));
		});

		it(`should pass finalize options to cjsFinalize`, async () => {
			const finalize = {packageTypes: false};
			await instance.transpileCjs({finalize, declarationComments: false});

			expect(cjsFinalize).toHaveBeenCalledWith(cjsDir, finalize);
		});
	});

	describe('transpileEsm', () => {
		it(`should build to './dist/esm' using './tsconfig.json' with module 'es2020'`, async () => {
			await instance.transpileEsm({declarationComments: false});

			expect(typescript).toHaveBeenCalledTimes(1);
			expect(typescript).toHaveBeenCalledWith(esmDir, './tsconfig.json', {module: 'es2020'}, undefined);
		});

		it(`should finalize ESM output only`, async () => {
			await instance.transpileEsm({declarationComments: false});

			expect(esmFinalize).toHaveBeenCalledWith(esmDir, null, undefined);
			expect(cjsFinalize).not.toHaveBeenCalled();
		});

		it(`should use esmTsConfigPath without overriding module`, async () => {
			await instance.transpileEsm({esmTsConfigPath: 'tsconfig.esm.json', declarationComments: false});

			expect(typescript).toHaveBeenCalledWith(esmDir, 'tsconfig.esm.json', {}, undefined);
		});

		it(`should use esmModule as module override`, async () => {
			await instance.transpileEsm({esmModule: 'esnext', declarationComments: false});

			expect(typescript).toHaveBeenCalledWith(esmDir, './tsconfig.json', {module: 'esnext'}, undefined);
		});

		it(`should apply esmCompilerOptions after esmModule`, async () => {
			await instance.transpileEsm({
				esmCompilerOptions: {module: 'es2022', target: 'es2022'},
				declarationComments: false
			});

			expect(typescript).toHaveBeenCalledWith(
				esmDir,
				'./tsconfig.json',
				{module: 'es2022', target: 'es2022'},
				undefined
			);
		});

		it(`should use shared tsConfigPath when esmTsConfigPath is not provided`, async () => {
			await instance.transpileEsm({tsConfigPath: 'tsconfig.build.json', declarationComments: false});

			expect(typescript).toHaveBeenCalledWith(esmDir, 'tsconfig.build.json', {module: 'es2020'}, undefined);
		});

		it(`should use custom outDir and esmDirName`, async () => {
			await instance.transpileEsm({outDir: './build', esmDirName: 'module', declarationComments: false});

			expect(typescript.mock.calls[0][0]).toBe(Path.join('./build', 'module'));
		});

		it(`should pass finalize options to esmFinalize`, async () => {
			const finalize = {rewriteImports: false};
			await instance.transpileEsm({finalize, declarationComments: false});

			expect(esmFinalize).toHaveBeenCalledWith(esmDir, null, finalize);
		});

		it(`should emit declarations before finalizing so rewritten specifiers are kept`, async () => {
			const order: string[] = [];
			declarations.mockImplementation(async () => {
				order.push('declarations');
			});
			(esmFinalize as jest.Mock).mockImplementationOnce(async () => {
				order.push('finalize');
			});

			await instance.transpileEsm({declarationComments: true});

			expect(order).toStrictEqual(['declarations', 'finalize']);
		});
	});

	describe('declarationComments', () => {
		it(`should emit declarations to the format's output dir when true`, async () => {
			await instance.transpileCjs({declarationComments: true});
			await instance.transpileEsm({declarationComments: true});

			expect(declarations).toHaveBeenCalledTimes(2);
			expect(declarations).toHaveBeenCalledWith(cjsDir, './tsconfig.json', undefined, undefined);
			expect(declarations).toHaveBeenCalledWith(esmDir, './tsconfig.json', undefined, undefined);
		});

		it(`should emit declarations using the format's own tsconfig by default`, async () => {
			await instance.transpileEsm({esmTsConfigPath: 'tsconfig.esm.json', declarationComments: true});

			expect(declarations).toHaveBeenCalledWith(esmDir, 'tsconfig.esm.json', undefined, undefined);
		});

		it(`should not emit declarations when false, even with typesTsConfigPath`, async () => {
			await instance.transpileAll({declarationComments: false, typesTsConfigPath: 'tsconfig.types.json'});

			expect(declarations).not.toHaveBeenCalled();
		});

		it(`should pass typesTsConfigPath, typesTscArgs, and tscPath`, async () => {
			await instance.transpileCjs({
				typesTsConfigPath: 'tsconfig.types.json',
				typesTscArgs: ['--stripInternal'],
				tscPath: '/custom/tsc.js'
			});

			expect(declarations).toHaveBeenCalledWith(
				cjsDir,
				'tsconfig.types.json',
				['--stripInternal'],
				'/custom/tsc.js'
			);
		});

		it(`should emit declarations when not set and tsconfig removes comments`, async () => {
			mockFs({'tsconfig.json': JSON.stringify({compilerOptions: {removeComments: true}})});

			await instance.transpileAll();
			mockFs.restore();

			expect(declarations).toHaveBeenCalledTimes(2);
		});

		it(`should not emit declarations when not set and tsconfig keeps comments`, async () => {
			mockFs({'tsconfig.json': JSON.stringify({compilerOptions: {}})});

			await instance.transpileAll();
			mockFs.restore();

			expect(declarations).not.toHaveBeenCalled();
		});
	});
});
