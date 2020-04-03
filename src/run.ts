import * as sourcemaps from 'gulp-sourcemaps';

import {dest, src} from 'gulp';

import {ArmorBuildConfig} from './config';
import {ArmorBuildFileUtils} from './file-utils';
import {ArmorBuildGulp} from './gulp';
import {EventEmitter} from 'events';
import Path from 'path';

// tslint:disable-next-line
const webpack = require('webpack');
// tslint:disable-next-line
const tsc = require('gulp-typescript');
// tslint:disable-next-line
const mergeStream = require('merge-stream');

export class ArmorBuildRun {
	public readonly events: EventEmitter;
	public readonly fileUtils: ArmorBuildFileUtils;
	public readonly config: ArmorBuildConfig;
	public readonly gulp: ArmorBuildGulp;

	constructor(events: EventEmitter, config: ArmorBuildConfig) {
		if (!events) {
			throw new Error('Armor Build (run) init failed - events argument missing in constructor.');
		}

		if (!config) {
			throw new Error('Armor Build (run) init failed - config argument missing in constructor.');
		}

		this.events = events;
		this.fileUtils = new ArmorBuildFileUtils();
		this.config = config;
		this.gulp = new ArmorBuildGulp(events, config);
	}

	public webpack(customPath?: string): Promise<any> {
		const standardPath = this.config.env === 'dev' ? './webpack.dev.js' : './webpack.prod.js';
		const configJsonPath = customPath ? customPath : standardPath;
		const resolvedPath = Path.resolve(standardPath);

		return new Promise((resolve, reject) => {
			import(resolvedPath).then((webpackConfig) => {
				webpack(webpackConfig, (err, stats) => {
					if (err) {
						console.error(`webpack build failed: ${err.message}.`);
						return reject(err);
					}

					if (stats.hasErrors()) {
						console.error('webpack build error: ');
						stats.compilation.errors.forEach((error) => {
							console.error(error);
						});
						return reject(stats.compilation.errors.join('\n'));
					}

					resolve();
				});
			});
		});
	}

	public tslint(tsConfigPath?: string): NodeJS.ReadWriteStream {
		return this.gulp.tslint(tsConfigPath);
	}

	public typescript(destPath: string, tsConfigPath?: string): Promise<any> {
		const useConfigPath = tsConfigPath ? tsConfigPath : './tsconfig.json';
		const tsConfig = require(Path.resolve(useConfigPath));
		const filesGlob = tsConfig.filesGlob;
		const tsResult = src(filesGlob).pipe(tsc(tsConfig.compilerOptions));
		return mergeStream(tsResult, tsResult.js).pipe(sourcemaps.write('.')).pipe(dest('dist'));
	}
}
