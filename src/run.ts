import {dest, src} from 'gulp';

import {BuildGulp} from './build/gulp';
import {Config} from './config';
import {EventEmitter} from 'events';
import {Log} from '@toreda/log';
import Path from 'path';
import {WebpackOptions} from './webpack/options';
import sourcemaps from 'gulp-sourcemaps';
import tsc from 'gulp-typescript';
import webpack from 'webpack';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mergeStream = require('merge-stream');

/**
 * Run other packages used in the build process with minimal config.
 *
 * @category Run
 */
export class Run {
	public readonly events: EventEmitter;
	public readonly cfg: Config;
	public readonly gulp: BuildGulp;
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

		this.gulp = new BuildGulp(cfg, events);
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
			import(resolvedPath).then((webpackConfig) => {
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

	public typescript(destPath: string, tsConfigPath?: string): Promise<NodeJS.ReadWriteStream> {
		const useConfigPath = tsConfigPath ? tsConfigPath : './tsconfig.json';
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const tsConfig = require(Path.resolve(useConfigPath));
		const filesGlob = tsConfig.filesGlob;
		const tsResult = src(filesGlob).pipe(tsc(tsConfig.compilerOptions));
		return mergeStream(tsResult, tsResult.js).pipe(sourcemaps.write('.')).pipe(dest('dist'));
	}
}
