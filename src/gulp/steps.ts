/**
 *	MIT License
 *
 *	Copyright (c) 2019 - 2022 Toreda, Inc.
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
import {Run} from '../run';
import type {TranspileOptions} from '../transpile/options';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nunjucksRender = require('gulp-nunjucks-render');

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

	public async transpile(options: TranspileOptions): Promise<NodeJS.ReadWriteStream> {
		const tsConfigDir = typeof options.tsConfigDirPath === 'string' ? options.tsConfigDirPath : './dist';
		const tsConfigFilname =
			typeof options.tsConfigFilePath === 'string' ? options.tsConfigDirPath : 'tsconfig.json';

		return await this.run.typescript(tsConfigDir, tsConfigFilname);
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
