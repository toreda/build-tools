import {BuildGulp} from './build/gulp';
import {BuildOptions} from './build/options';
import {Cleaner} from './cleaner';
import {Config} from './config';
import {Create} from './create';
import {EventEmitter} from 'events';
import {FileHelpers} from './file/helpers';
import {FileOptions} from './file/options';
import {GulpSteps} from './gulp/steps';
import {Log} from '@toreda/log';
import {Run} from './run';
import {isType} from '@toreda/strong-types';
import yargs from 'yargs';

export class Build {
	/** Global events instance. */
	public readonly events: EventEmitter;
	public readonly gulp: BuildGulp;
	public readonly cfg: Config;
	public readonly run: Run;
	public readonly cleaner: Cleaner;
	public readonly create: Create;
	public readonly gulpSteps: GulpSteps;
	public readonly log: Log;
	public readonly fileUtils: FileHelpers;

	constructor(options: BuildOptions) {
		this.events = this.makeEvents();

		this.log = this.makeLog(options);

		const cfg = this.createConfig();
		this.fileUtils = new FileHelpers(this.log);
		this.run = new Run(cfg, this.events, this.log);
		this.cleaner = new Cleaner(cfg, this.events, this.log);
		this.create = new Create(cfg, this.events, this.log);
		this.cfg = new Config();
		this.gulpSteps = new GulpSteps(this.gulp, this.run, this.create, this.cleaner);
	}

	public makeLog(options?: BuildOptions): Log {
		if (!options || !options.log) {
			return new Log().makeLog('Build');
		}

		if (!isType(options.log, Log)) {
			return new Log().makeLog('Build');
		}

		return options.log.makeLog('Build');
	}

	public makeEvents(options?: BuildOptions): EventEmitter {
		if (!options || !options.events) {
			return new EventEmitter();
		}

		if (!isType(options.events, EventEmitter)) {
			return new EventEmitter();
		}

		return options.events;
	}

	/**
	 * Create initial internal state object for build tools instance.
	 * @returns
	 */
	public createConfig(): Config {
		if (!yargs) {
			throw new Error('Failed parsing args - could not find yargs npm package.');
		}

		const cfg = new Config();

		const args = yargs(process.argv).argv;

		if (typeof args.env === 'string') {
			const lowerEnv = args.env.toLowerCase();
			if (lowerEnv === 'dev' || lowerEnv === 'development') {
				cfg.env('dev');
			} else {
				cfg.env('prod');
			}
		}

		return cfg;
	}

	public getContents(path: string, options?: FileOptions): Promise<string | null> {
		return this.fileUtils.getContents(path, options);
	}
}
