import {BuildCreate} from './build/create';
import {BuildGulp} from './build/gulp';
import {BuildRun} from './build/run';
import {BuildState} from './build/state';
import {Cleaner} from './cleaner';
import {EventEmitter} from 'events';
import {FileHelpers} from './file/helpers';
import {FileOptions} from './file/options';
import {GulpSteps} from './gulp/steps';
import yargs from 'yargs';

export class BuildTools {
	/** Global events instance. */
	public readonly events: EventEmitter;
	public readonly gulp: BuildGulp;
	public readonly state: BuildState;
	public readonly run: BuildRun;
	public readonly cleaner: Cleaner;
	public readonly create: BuildCreate;
	public readonly gulpSteps: GulpSteps;

	public readonly fileUtils: FileHelpers;

	constructor(events?: EventEmitter) {
		this.events = events ? events : new EventEmitter();
		const state = this.createState();
		this.fileUtils = new FileHelpers();
		this.run = new BuildRun(this.events, state);
		this.cleaner = new Cleaner(this.events, state);
		this.create = new BuildCreate(this.events, state);
		this.state = state;
		this.gulpSteps = new GulpSteps(this.gulp, this.run, this.create, this.cleaner);
	}

	/**
	 * Create initial internal state object for build tools instance.
	 * @returns
	 */
	public createState(): BuildState {
		if (!yargs) {
			throw new Error('Failed parsing args - could not find yargs npm package.');
		}

		const state = new BuildState();

		const args = yargs(process.argv).argv;

		if (typeof args.env === 'string') {
			const lowerEnv = args.env.toLowerCase();
			if (lowerEnv === 'dev' || lowerEnv === 'development') {
				state.env('dev');
			} else {
				state.env('prod');
			}
		}

		return state;
	}

	public getContents(path: string, options?: FileOptions): Promise<string | null> {
		return this.fileUtils.getContents(path, options);
	}
}
