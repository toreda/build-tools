import * as yargs from 'yargs';

import {ArmorBTClean} from './clean';
import {ArmorBTConfig} from './config';
import { ArmorBTCreate } from './create';
import {ArmorBTFileUtils} from './file-utils';
import {ArmorBTFilesGetContentsOptions} from './get-contents-options';
import {ArmorBTGulp} from './gulp';
import {ArmorBTRun} from './run';
import {EventEmitter} from 'events';
import Path from 'path';

export class ArmorBuildTools {
	public readonly events: EventEmitter;
	public readonly gulp: ArmorBTGulp;
	public readonly config: ArmorBTConfig;
	public readonly run: ArmorBTRun;
	public readonly clean: ArmorBTClean;
	public readonly create: ArmorBTCreate;

	public readonly fileUtils: ArmorBTFileUtils;

	constructor(events: EventEmitter) {
		this.events = events;
		this.config = this.parseArgs();
		this.fileUtils = new ArmorBTFileUtils();
		this.run = new ArmorBTRun(events, this.config);
		this.clean = new ArmorBTClean(events, this.config);
		this.create = new ArmorBTCreate(events, this.config);
	}

	public parseArgs(): ArmorBTConfig {
		if (!yargs) {
			throw new Error('Failed parsing args - could not find yargs npm package.');
		}

		const argv = yargs.argv;
		const config = new ArmorBTConfig();

		if (typeof argv.env === 'string') {
			const lowerEnv = argv.env.toLowerCase();
			if (lowerEnv === 'dev' || lowerEnv === 'development') {
				config.env = 'dev';
			} else {
				config.env = 'prod';
			}
		}

		return config;
	}

	public getContents(path: string, options?: ArmorBTFilesGetContentsOptions): Promise<string | Error> {
		return this.fileUtils.getContents(path, options);
	}
}
