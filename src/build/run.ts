import {dest, src} from 'gulp';

import {BuildGulp} from './gulp';
import {BuildState} from './state';
import {EventEmitter} from 'events';
import {FileHelpers} from '../file/helpers';
import Path from 'path';
import sourcemaps from 'gulp-sourcemaps';
import tsc from 'gulp-typescript';
import webpack from 'webpack';

// tslint:disable-next-line
const mergeStream = require('merge-stream');

export class BuildRun {
	public readonly events: EventEmitter;
	public readonly fileUtils: FileHelpers;
	public readonly state: BuildState;
	public readonly gulp: BuildGulp;

	constructor(events: EventEmitter, state: BuildState) {
		if (!events) {
			throw new Error('BuildRun init - events arg is missing.');
		}

		if (!state) {
			throw new Error('BuildRun init - state arg is missing.');
		}

		this.fileUtils = new FileHelpers();
		this.events = events;
		this.state = state;

		this.gulp = new BuildGulp(this.state, events);
	}

	public webpack(customPath?: string): Promise<NodeJS.ReadWriteStream> {
		const standardPath = this.state.env() === 'dev' ? './webpack.dev.js' : './webpack.prod.js';
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
