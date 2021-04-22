import yargs from 'yargs';

import {BuildCreate} from './build/create';
import {BuildGulp} from './build/gulp';
import {BuildRun} from './build/run';
import {BuildState} from './build/state';
import {BuildSteps} from './build/steps';
import {Cleaner} from './cleaner';
import {EventEmitter} from 'events';
import {FileHelpers} from './file/helpers';
import {FileOptions} from './file/options';

export class BuildTools {
	public readonly events: EventEmitter;
	public readonly gulp: BuildGulp;
	public readonly state: BuildState;
	public readonly run: BuildRun;
	public readonly cleaner: Cleaner;
	public readonly create: BuildCreate;
	public readonly steps: BuildSteps;

	public readonly fileUtils: FileHelpers;

	constructor(events?: EventEmitter) {
		this.events = events ? events : new EventEmitter();
		const state = this.createState();
		this.fileUtils = new FileHelpers();
		this.run = new BuildRun(this.events, state);
		this.cleaner = new Cleaner(this.events, state);
		this.create = new BuildCreate(this.events, state);
		this.state = state;
		this.steps = new BuildSteps(this.gulp, this.run, this.create, this.cleaner);
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

	public getContents(path: string, options?: FileOptions): Promise<string | Error> {
		return this.fileUtils.getContents(path, options);
	}
}
