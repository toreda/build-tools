/**
 *	MIT License
 *
 *	Copyright (c) 2019 - 2022 Toreda, Inc.
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:

 * 	The above copyright notice and this permission notice shall be included in all
 * 	copies or substantial portions of the Software.
 *
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * 	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * 	SOFTWARE.
 *
 */

import type {BuildOptions} from './build/options';
import {Clean} from './clean';
import {Cli} from './cli';
import type {CliArgs} from './cli/args';
import {Config} from './config';
import {Create} from './create';
import {EventEmitter} from 'events';
import type {FileOptions} from './file/options';
import {GulpSteps} from './gulp/steps';
import {Linter} from './linter';
import {Log} from '@toreda/log';
import {Run} from './run';
import {fileContents} from './file/contents';

/**
 * Top level build class accepting configuration options on init and creating
 * all required classes and objects needed for most common use cases.
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
	/** Perform linter operations using ESLint. */
	public readonly linter: Linter;
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
		this.linter = new Linter(this.cfg, this.events, this.log);

		this.gulpSteps = new GulpSteps(this.run, this.create, this.linter, this.clean, this.log);
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
			return new Log(options.log).makeLog('Build');
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
