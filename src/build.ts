import {BuildOptions} from './build/options';
import {Clean} from './clean';
import {CliArgs} from './cli/args';
import {Config} from './config';
import {Create} from './create';
import {EventEmitter} from 'events';
import {FileOptions} from './file/options';
import {GulpSteps} from './gulp/steps';
import {Log} from '@toreda/log';
import {Run} from './run';
import {fileContents} from './file/contents';
import {hideBin} from 'yargs/helpers';
import yargs from 'yargs';

/**
 *
 * @category Build
 */
export class Build {
	/** Global EventEmitter instance. */
	public readonly events: EventEmitter;
	/** Global config instance. */
	public readonly cfg: Config;
	/** Wrappers to run build processes. */
	public readonly run: Run;
	/** Clean files and folders. */
	public readonly clean: Clean;
	/** Create files and folders. */
	public readonly create: Create;
	/** Build steps wrapped in Gulp compatible functions. */
	public readonly gulpSteps: GulpSteps;
	/** Global log instance. */
	public readonly log: Log;

	/**
	 *
	 * @param options 		Configuration options used to initialize Build config.
	 */
	constructor(options: BuildOptions) {
		this.events = this.initEvents();

		const log = this.initLog(options);
		this.log = log.makeLog('Build');

		const cfg = this.initConfig(hideBin(process.argv));
		this.run = new Run(cfg, this.events, this.log);
		this.clean = new Clean(cfg, this.events, this.log);
		this.create = new Create(cfg, this.events, this.log);
		this.cfg = new Config();
		this.gulpSteps = new GulpSteps(this.run, this.create, this.clean);
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

		if (!(options.log instanceof Log)) {
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

		if (!(options.events instanceof EventEmitter)) {
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

		const args: CliArgs = yargs(argv).options({
			env: {
				demand: false,
				type: 'string',
				default: 'prod',
				description: 'Build environment'
			}
		}).argv as CliArgs;

		if (typeof args.env === 'string') {
			const lowerEnv = args.env.toLowerCase();
			if (lowerEnv === 'dev' || lowerEnv === 'development') {
				cfg.env = 'dev';
			} else {
				cfg.env = 'prod';
			}
		}

		return cfg;
	}

	public async getContents(path: string, options?: FileOptions): Promise<string | null> {
		return fileContents(path, options);
	}
}
