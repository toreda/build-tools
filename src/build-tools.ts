import * as yargs from 'yargs';

import {BuildClean} from './clean';
import {BuildCreate} from './create';
import {BuildFileUtils} from './file-utils';
import {BuildFilesGetContentsOptions} from './get-contents-options';
import {BuildGulp} from './gulp';
import {BuildRun} from './run';
import {BuildState} from './state';
import {BuildSteps} from './steps';
import {EventEmitter} from 'events';
import Path from 'path';

export class BuildTools {
	public readonly events: EventEmitter;
	public readonly gulp: BuildGulp;
	public readonly state: BuildState;
	public readonly run: BuildRun;
	public readonly clean: BuildClean;
	public readonly create: BuildCreate;
	public readonly steps: BuildSteps;

	public readonly fileUtils: BuildFileUtils;

	constructor(events?: EventEmitter) {
		this.events = events ? events : new EventEmitter();
		const state = this.createState();
		this.fileUtils = new BuildFileUtils();
		this.run = new BuildRun(this.events, state);
		this.clean = new BuildClean(this.events, state);
		this.create = new BuildCreate(this.events, state);
		this.state = state;
		this.steps = new BuildSteps(this.gulp, this.run, this.create, this.clean);
	}

	public createState(): BuildState {
		if (!yargs) {
			throw new Error('Failed parsing args - could not find yargs npm package.');
		}

		const argv = yargs.argv;
		const state = new BuildState();

		if (typeof argv.env === 'string') {
			const lowerEnv = argv.env.toLowerCase();
			if (lowerEnv === 'dev' || lowerEnv === 'development') {
				state.env('dev');
			} else {
				state.env('prod');
			}
		}

		return state;
	}

	public getContents(path: string, options?: BuildFilesGetContentsOptions): Promise<string | Error> {
		return this.fileUtils.getContents(path, options);
	}
}
