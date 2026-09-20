/**
 *	MIT License
 *
 *	Copyright (c) 2019 - 2026 Toreda, Inc.
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:

 * 	The above copyright notice and this permission notice shall be included in all
 * 	copies or substantial portions of the Software.
 *
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * 	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * 	SOFTWARE.
 *
 */

import {dest, src} from 'gulp';

import {Clean} from '../clean';
import {Create} from '../create';
import {Linter} from '../linter';
import {LinterTarget} from '../linter/target';
import {Log} from '@toreda/log';
import Path from 'path';
import {Run} from '../run';
import type {TranspileFormat} from '../transpile/format';
import type {TranspileOptions} from '../transpile/options';
import {cjsFinalize, esmFinalize} from '../esm/finalize';
import {finished} from 'stream/promises';
import nunjucksRender from 'gulp-nunjucks-render';
import {readFileSync} from 'fs';
import {transpileFormats} from '../transpile/formats';

/**
 * Build steps that can be used directly in gulp.
 *
 * @category Gulp
 */
export class GulpSteps {
	private readonly run: Run;
	/** Create files and directories. */
	private readonly create: Create;
	/** Clean files & folders in preparation for build. */
	private readonly clean: Clean;
	private readonly linter: Linter;
	private readonly log: Log;
	/**
	 * Constructor
	 * @param build
	 * @param run
	 * @param create
	 * @param clean
	 */
	constructor(run: Run, create: Create, linter: Linter, clean: Clean, log: Log) {
		this.run = run;
		this.create = create;
		this.clean = clean;
		this.linter = linter;
		this.log = log.makeLog('GulpSteps');
	}

	/**
	 * Run preconfigured webpack build step.
	 * @returns
	 */
	public async webpack(): Promise<NodeJS.ReadWriteStream> {
		await this.run.webpack();

		return src('.', {allowEmpty: true});
	}

	/**
	 * Recursively copy src dir contents matching regex pattern to target dest dir.
	 * @param srcPattern		Regex pattern matching designed src files.
	 * @param destPath			Target dir where contents are copied to.
	 * @returns
	 */
	public copyContents(srcPattern: string, destPath: string): NodeJS.ReadWriteStream {
		return src(srcPattern).pipe(dest(destPath));
	}

	public async createDir(
		targetPath: string | string[],
		overwrite?: boolean
	): Promise<NodeJS.ReadWriteStream> {
		const targetPaths: string[] = Array.isArray(targetPath) ? targetPath : [];

		if (typeof targetPath === 'string') {
			targetPaths.push(targetPath);
		}

		for (const target of targetPaths) {
			await this.create.dir(target, overwrite);
		}

		return src('.', {allowEmpty: true});
	}

	/**
	 * Recursively remove all files and folders from targetPath, and
	 * then removes the target folder.
	 * @param targetPath
	 * @returns
	 */
	public async cleanDir(targetPath: string | string[], force?: boolean): Promise<NodeJS.ReadWriteStream> {
		const targetPaths: string[] = Array.isArray(targetPath) ? targetPath : [];

		if (typeof targetPath === 'string') {
			targetPaths.push(targetPath);
		}

		for (const target of targetPaths) {
			await this.clean.dir(target, force);
		}

		return src('.', {allowEmpty: true});
	}

	/**
	 * Transpile typescript sources to each target format, in the order provided. Each format
	 * key calls the matching `transpile{Format}` step. e.g. `['cjs', 'esm']` calls
	 * `transpileCjs` then `transpileEsm`.
	 * @param formats		Format keys to transpile. Duplicate keys are only transpiled once.
	 * @param options		Options shared by all formats.
	 * @returns
	 */
	public async transpile(
		formats: TranspileFormat[],
		options: TranspileOptions = {}
	): Promise<NodeJS.ReadWriteStream> {
		if (!Array.isArray(formats) || formats.length === 0) {
			throw new Error('transpile failed - formats arg must be a non-empty array of format keys.');
		}

		const steps = this.transpileSteps();

		for (const format of formats) {
			if (!Object.prototype.hasOwnProperty.call(steps, format)) {
				const supported = Object.keys(steps).join(', ');
				throw new Error(
					`transpile failed - unsupported format '${format}'. Supported: ${supported}.`
				);
			}
		}

		for (const format of new Set(formats)) {
			await steps[format](options);
		}

		return src('.', {allowEmpty: true});
	}

	/**
	 * Transpile typescript sources to every supported format.
	 * @param options		Options shared by all formats.
	 * @returns
	 */
	public async transpileAll(options: TranspileOptions = {}): Promise<NodeJS.ReadWriteStream> {
		return this.transpile(transpileFormats(), options);
	}

	/**
	 * Transpile typescript sources to CommonJS output. Output dir gets a package.json with
	 * type `commonjs`, so Node reads it correctly regardless of the root package.json `type`.
	 * @param options
	 * @returns
	 */
	public async transpileCjs(options: TranspileOptions = {}): Promise<NodeJS.ReadWriteStream> {
		const cjsDir = this.transpileDir(options, options.cjsDirName, 'cjs');
		const tsConfigPath = this.transpileTsConfigPath(options, options.cjsTsConfigPath);
		const cjsModule = typeof options.cjsModule === 'string' ? options.cjsModule : 'commonjs';
		// A separate CJS tsconfig is expected to set its own module format.
		const compilerOptions =
			typeof options.cjsTsConfigPath === 'string'
				? {...options.cjsCompilerOptions}
				: {module: cjsModule, ...options.cjsCompilerOptions};

		await finished(this.run.typescript(cjsDir, tsConfigPath, compilerOptions, options.srcPatterns));
		await this.transpileDeclarations(cjsDir, tsConfigPath, options);
		await cjsFinalize(cjsDir, options.finalize);

		return src('.', {allowEmpty: true});
	}

	/**
	 * Transpile typescript sources to ES module output. Output is fixed up to run in Node:
	 * relative imports get file extensions, and the output dir gets a package.json with
	 * type `module`.
	 * @param options
	 * @returns
	 */
	public async transpileEsm(options: TranspileOptions = {}): Promise<NodeJS.ReadWriteStream> {
		const esmDir = this.transpileDir(options, options.esmDirName, 'esm');
		const tsConfigPath = this.transpileTsConfigPath(options, options.esmTsConfigPath);
		const esmModule = typeof options.esmModule === 'string' ? options.esmModule : 'es2020';
		// A separate ESM tsconfig is expected to set its own module format.
		const compilerOptions =
			typeof options.esmTsConfigPath === 'string'
				? {...options.esmCompilerOptions}
				: {module: esmModule, ...options.esmCompilerOptions};

		await finished(this.run.typescript(esmDir, tsConfigPath, compilerOptions, options.srcPatterns));
		// Declarations are emitted before finalizing, so their import specifiers are also rewritten.
		await this.transpileDeclarations(esmDir, tsConfigPath, options);
		await esmFinalize(esmDir, null, options.finalize);

		return src('.', {allowEmpty: true});
	}

	/**
	 * Steps called for each transpile format key. Supporting a new format
	 * requires a key in `TranspileFormat` and a matching step here.
	 * @returns
	 */
	private transpileSteps(): Record<
		TranspileFormat,
		(options: TranspileOptions) => Promise<NodeJS.ReadWriteStream>
	> {
		return {
			cjs: (options) => this.transpileCjs(options),
			esm: (options) => this.transpileEsm(options)
		};
	}

	private transpileDir(
		options: TranspileOptions,
		dirName: string | undefined,
		defaultName: string
	): string {
		const outDir = typeof options.outDir === 'string' ? options.outDir : './dist';

		return Path.join(outDir, typeof dirName === 'string' ? dirName : defaultName);
	}

	private transpileTsConfigPath(options: TranspileOptions, formatTsConfigPath?: string): string {
		if (typeof formatTsConfigPath === 'string') {
			return formatTsConfigPath;
		}

		return typeof options.tsConfigPath === 'string' ? options.tsConfigPath : './tsconfig.json';
	}

	/**
	 * Emit declarations again with comments intact when needed for target output dir.
	 * @param destPath
	 * @param tsConfigPath		Path to tsconfig used to transpile target output.
	 * @param options
	 */
	private async transpileDeclarations(
		destPath: string,
		tsConfigPath: string,
		options: TranspileOptions
	): Promise<void> {
		if (!this.declarationComments(options, tsConfigPath)) {
			return;
		}

		const typesConfigPath =
			typeof options.typesTsConfigPath === 'string' ? options.typesTsConfigPath : tsConfigPath;

		await this.run.declarations(destPath, typesConfigPath, options.typesTscArgs, options.tscPath);
	}

	/**
	 * Check whether declarations should be emitted again with comments intact.
	 * @param options
	 * @param tsConfigPath
	 * @returns
	 */
	private declarationComments(options: TranspileOptions, tsConfigPath: string): boolean {
		if (typeof options.declarationComments === 'boolean') {
			return options.declarationComments;
		}

		if (typeof options.typesTsConfigPath === 'string') {
			return true;
		}

		// Declarations only lose comments when the transpile removed them.
		const tsConfig = JSON.parse(readFileSync(Path.resolve(tsConfigPath), 'utf8'));

		return tsConfig?.compilerOptions?.removeComments === true;
	}

	/**
	 * Lint all source files identified by target srcPattern globs.
	 * @param tgt
	 * @returns
	 */
	public async lint(tgt: LinterTarget): Promise<NodeJS.ReadWriteStream> {
		const fnLog = this.log.makeLog('lint');
		const summary = await this.linter.execute(tgt);

		if (!summary.status.success) {
			const msg = `Linter did not complete successfully due to error code '${summary.status.code}'. ${summary.status.description}.`;

			if (tgt.abortOnLimitBreak === true) {
				throw new Error(msg);
			} else {
				fnLog.error(msg);
			}
		}

		return src('.', {allowEmpty: true});
	}

	public renderNunjucksHtml(
		templatePath: string,
		srcPattern: string,
		destPath: string
	): NodeJS.ReadWriteStream {
		return src(srcPattern)
			.pipe(
				nunjucksRender({
					path: templatePath
				})
			)
			.pipe(dest(destPath));
	}
}
