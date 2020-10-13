import * as sourcemaps from 'gulp-sourcemaps';

import {dest, src} from 'gulp';

import {BuildFileUtils} from './file-utils';
import {BuildGulp} from './gulp';
import {BuildOptions} from './options';
import {BuildState} from './state';
import {EventEmitter} from 'events';
import Path from 'path';

// tslint:disable-next-line
const webpack = require('webpack');
// tslint:disable-next-line
const tsc = require('gulp-typescript');
// tslint:disable-next-line
const mergeStream = require('merge-stream');

export class BuildRun {
	public readonly events: EventEmitter;
	public readonly fileUtils: BuildFileUtils;
	public readonly state: BuildState;
	public readonly gulp: BuildGulp;

	constructor(events: EventEmitter, state: BuildState) {
		if (!events) {
			throw new Error('BuildTools Run init failed - constructor arg missing.');
		}

		if (!state) {
			throw new Error('BuildTools Run init failed - state arg missing.');
		}

		this.fileUtils = new BuildFileUtils();
		this.events = events;
		this.state = state;

		this.gulp = new BuildGulp(events, this.state);
	}

	public webpack(customPath?: string): Promise<NodeJS.ReadWriteStream> {
		const standardPath = this.state.env() === 'dev' ? './webpack.dev.js' : './webpack.prod.js';
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
