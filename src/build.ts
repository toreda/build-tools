import {BuildOptions} from './build/options';
import {Clean} from './clean';
import {Cli} from './cli';
import {CliArgs} from '.';
import {Config} from './config';
import {Create} from './create';
import {EventEmitter} from 'events';
import {FileOptions} from './file/options';
import {GulpSteps} from './gulp/steps';
import {Log} from '@toreda/log';
import {Run} from './run';
import {fileContents} from './file/contents';

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
	/** Command line args */
	public readonly cli: Cli;

	/**
	 *
	 * @param options 		Configuration options used to initialize Build config.
	 */
	constructor(options: BuildOptions) {
		this.events = this.initEvents();

		this.log = this.initLog(options);
		this.cli = new Cli(this.log);

		this.cfg = this.initConfig(this.cli.getArgs(), options, this.log);
		this.run = new Run(this.cfg, this.events, this.log);
		this.clean = new Clean(this.cfg, this.events, this.log);
		this.create = new Create(this.cfg, this.events, this.log);

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
			return new Log().makeLog('Build');
		}

		if (!(options.log instanceof Log)) {
			return new Log().makeLog('Build');
		}

		return options.log.makeLog('Build');
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
	public initConfig(args: CliArgs, options: BuildOptions, baseLog: Log): Config {
		const log = baseLog.makeLog('initConfig');

		return new Config(args, options, log);
	}

	public async getContents(path: string, options?: FileOptions): Promise<string | null> {
		return fileContents(path, options);
	}
}
