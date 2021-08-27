import {dest, src} from 'gulp';

import {BuildGulp} from './build/gulp';
import {Config} from './config';
import {EventEmitter} from 'events';
import {FileHelpers} from './file/helpers';
import {Log} from '@toreda/log';
import Path from 'path';
import sourcemaps from 'gulp-sourcemaps';
import tsc from 'gulp-typescript';
import webpack from 'webpack';

// tslint:disable-next-line
const mergeStream = require('merge-stream');

export class Run {
	public readonly events: EventEmitter;
	public readonly fileUtils: FileHelpers;
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
		this.fileUtils = new FileHelpers(this.log);
		this.events = events;
		this.cfg = cfg;

		this.gulp = new BuildGulp(cfg, events);
	}

	public webpack(customPath?: string): Promise<NodeJS.ReadWriteStream> {
		const standardPath = this.cfg.env() === 'dev' ? './webpack.dev.js' : './webpack.prod.js';
		const configJsonPath = typeof customPath === 'string' ? customPath : standardPath;
		const resolvedPath = Path.resolve(configJsonPath);

		return new Promise((resolve, reject) => {
			import(resolvedPath).then((webpackConfig) => {
				webpack(webpackConfig, (err, stats) => {
					if (err) {
						console.error(`webpack build failed: ${err.message}.`);
						return reject(err);
					}

					if (!stats) {
						throw new Error('weback build failure: no stats in build callback');
					}

					if (stats.hasErrors()) {
						console.error('webpack build error: ');
						stats.compilation.errors.forEach((error) => {
							console.error(error);
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
		const tsConfig = require(Path.resolve(useConfigPath));
		const filesGlob = tsConfig.filesGlob;
		const tsResult = src(filesGlob).pipe(tsc(tsConfig.compilerOptions));
		return mergeStream(tsResult, tsResult.js).pipe(sourcemaps.write('.')).pipe(dest('dist'));
	}
}
