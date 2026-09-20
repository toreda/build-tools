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

import {Config} from './config';
import {EventEmitter} from 'events';
import {Log} from '@toreda/log';
import Path from 'path';
import {WebpackOptions} from './webpack/options';
import {createRequire} from 'module';
import {execFile} from 'child_process';
import mergeStream from 'merge-stream';
import {pathToFileURL} from 'url';
import {readFileSync} from 'fs';
import sourcemaps from 'gulp-sourcemaps';
import tsc from 'gulp-typescript';
import webpack from 'webpack';

/**
 * Run other packages used in the build process with minimal config.
 *
 * @category Run
 */
export class Run {
	public readonly events: EventEmitter;
	public readonly cfg: Config;
	public readonly log: Log;

	constructor(cfg: Config, events: EventEmitter, log: Log) {
		if (!cfg) {
			throw new Error('Run init - cfg arg missing.');
		}

		if (!events) {
			throw new Error('Run init - events arg missing.');
		}

		this.log = log.makeLog('Run');
		this.events = events;
		this.cfg = cfg;
	}

	/**
	 * Run webpack during build process.
	 * @param options		Options provided to webpack.
	 * @returns
	 */
	public webpack(options: WebpackOptions = {}): Promise<NodeJS.ReadWriteStream> {
		const fnLog = this.log.makeLog('webpack');
		fnLog.debug('Webpack started');
		const cfgPath = this.cfg.getWebpackCfgPath(options);

		const resolvedPath = Path.resolve(cfgPath);

		return new Promise((resolve, reject) => {
			// CJS output loads the config with require. ESM output has no require and
			// needs a file URL to import absolute windows paths.
			const loaded: Promise<any> =
				typeof require === 'function'
					? // eslint-disable-next-line @typescript-eslint/no-require-imports
						Promise.resolve(require(resolvedPath))
					: import(pathToFileURL(resolvedPath).href);

			loaded.then((mod) => {
				const webpackConfig = mod.default ?? mod;

				webpack(webpackConfig, (err, stats) => {
					if (err) {
						fnLog.error(`Webpack stopped due to failure: ${err.message}.`);
						return reject(err);
					}

					if (!stats) {
						throw new Error('weback build failure: no stats in build callback');
					}

					if (stats.hasErrors()) {
						fnLog.error('webpack build error: ');
						stats.compilation.errors.forEach((error) => {
							fnLog.error(error);
						});
						return reject(stats.compilation.errors.join('\n'));
					}

					resolve(src('.', {allowEmpty: true}));
				});
			});
		});
	}

	/**
	 * Transpile typescript sources using `compilerOptions` from target tsconfig.
	 * @param destPath			Dir where transpiled output is written.
	 * @param tsConfigPath		Path to tsconfig file. Defaults to `./tsconfig.json`.
	 * @param compilerOptions	Overrides applied on top of tsconfig `compilerOptions`. Allows
	 *							multiple outputs (e.g. CJS + ESM) from a single tsconfig.
	 * @param srcPatterns		Glob patterns matching source files to transpile. Defaults to
	 *							`filesGlob` in the tsconfig, then all `.ts` files in `./src`.
	 * @returns
	 */
	public typescript(
		destPath: string,
		tsConfigPath?: string,
		compilerOptions?: tsc.Settings,
		srcPatterns?: string[]
	): NodeJS.ReadWriteStream {
		const outputPath = typeof destPath === 'string' ? destPath : 'dist';
		const useConfigPath = tsConfigPath ? tsConfigPath : './tsconfig.json';
		const tsConfig = JSON.parse(readFileSync(Path.resolve(useConfigPath), 'utf8'));
		// filesGlob is not a standard tsconfig field. Projects may not have one.
		const filesGlob = Array.isArray(srcPatterns)
			? srcPatterns
			: Array.isArray(tsConfig.filesGlob)
				? tsConfig.filesGlob
				: ['./src/**/*.ts'];

		const tsResult = src(filesGlob).pipe(tsc({...tsConfig.compilerOptions, ...compilerOptions}));
		return mergeStream<NodeJS.ReadableStream>(tsResult, tsResult.js)
			.pipe(sourcemaps.write('.'))
			.pipe(dest(outputPath));
	}

	/**
	 * Emit declaration files only, with comments intact. Transpiling with `removeComments`
	 * also strips comments from declarations, which removes JSDoc hover docs for consumers.
	 * Declarations never reach a runtime bundle, so re-emitting them with comments is safe.
	 * @param destPath			Dir where declaration files are written.
	 * @param tsConfigPath		Path to tsconfig file. Defaults to `./tsconfig.json`.
	 * @param tscArgs			Additional `tsc` command line args. Applied last, so they
	 *							override the args used by default.
	 * @param tscPath			Path to the `tsc` script. Defaults to the `typescript` package
	 *							resolved from the current working dir.
	 * @returns
	 */
	public declarations(
		destPath: string,
		tsConfigPath?: string,
		tscArgs?: string[],
		tscPath?: string
	): Promise<void> {
		const fnLog = this.log.makeLog('declarations');
		const useConfigPath = tsConfigPath ? tsConfigPath : './tsconfig.json';
		const extraArgs = Array.isArray(tscArgs) ? tscArgs : [];
		const args = [
			typeof tscPath === 'string' ? tscPath : this.tscPath(),
			'-p',
			useConfigPath,
			'--outDir',
			destPath,
			'--declaration',
			'--emitDeclarationOnly',
			'--removeComments',
			'false',
			...extraArgs
		];

		return new Promise((resolve, reject) => {
			execFile(process.execPath, args, (err, stdout, stderr) => {
				if (err) {
					fnLog.error(`tsc failed:
${stdout}${stderr}`);
					return reject(err);
				}

				resolve();
			});
		});
	}

	/**
	 * Find the `tsc` script in the `typescript` package installed by the project being built.
	 * @returns
	 */
	public tscPath(): string {
		// Resolve from the current working dir. createRequire works in both CJS and ESM output.
		const projectRequire = createRequire(Path.resolve('package.json'));

		return Path.join(Path.dirname(projectRequire.resolve('typescript')), 'tsc.js');
	}
}
