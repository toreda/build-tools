import {BuildGulp} from './build/gulp';
import {BuildOptions} from './build/options';
import {Cleaner} from './cleaner';
import {Config} from './config';
import {Create} from './create';
import {EventEmitter} from 'events';
import {FileOptions} from './file/options';
import {GulpSteps} from './gulp/steps';
import {Log} from '@toreda/log';
import {Run} from './run';
import {fileContents} from './file/contents';
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

	constructor(options: BuildOptions) {
		this.events = this.initEvents();

		const log = this.initLog(options);
		this.log = log.makeLog('Build');

		const cfg = this.initConfig(process.argv.splice(2));
		this.run = new Run(cfg, this.events, this.log);
		this.cleaner = new Cleaner(cfg, this.events, this.log);
		this.create = new Create(cfg, this.events, this.log);
		this.cfg = new Config();
		this.gulpSteps = new GulpSteps(this.gulp, this.run, this.create, this.cleaner);
	}

	/**
	 * Initialize log property for Build class. Uses log instance in options if provided,
	 * otherwise creates a new Log instance.
	 * @param options
	 * @returns
	 */
	public initLog(options?: BuildOptions): Log {
		if (!options || !options.log) {
			return new Log();
		}

		if (!isType(options.log, Log)) {
			return new Log();
		}

		return options.log;
	}

	/**
	 * Initialize events property for Build class. Uses events instance in options if provided,
	 * otherwise creates a new EventEmitter instance.
	 * @param options
	 * @returns
	 */
	public initEvents(options?: BuildOptions): EventEmitter {
		if (!options || !options.events) {
			return new EventEmitter();
		}

		if (!isType(options.events, EventEmitter)) {
			return new EventEmitter();
		}

		return options.events;
	}

	/**
	 * Initialize config property for Build class. Reads in CLI arguments to
	 * set initial config keys.
	 * @param argv
	 * @returns
	 */
	public initConfig(argv: string[]): Config {
		if (!yargs) {
			throw new Error('Failed parsing args - could not find yargs npm package.');
		}

		const cfg = new Config();

		const args = yargs(argv).argv;

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

	public async getContents(path: string, options?: FileOptions): Promise<string | null> {
		return fileContents(path, options);
	}
}
