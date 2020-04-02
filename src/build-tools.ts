import * as yargs from 'yargs';

import {ArmorBuildClean} from './clean';
import {ArmorBuildConfig} from './config';
import {ArmorBuildCreate} from './create';
import {ArmorBuildFileUtils} from './file-utils';
import {ArmorBuildFilesGetContentsOptions} from './get-contents-options';
import {ArmorBuildGulp} from './gulp';
import {ArmorBuildRun} from './run';
import {EventEmitter} from 'events';
import Path from 'path';

export class ArmorBuild {
	public readonly events: EventEmitter;
	public readonly gulp: ArmorBuildGulp;
	public readonly config: ArmorBuildConfig;
	public readonly run: ArmorBuildRun;
	public readonly clean: ArmorBuildClean;
	public readonly create: ArmorBuildCreate;

	public readonly fileUtils: ArmorBuildFileUtils;

	constructor(events: EventEmitter) {
		this.events = events;
		this.config = this.parseArgs();
		this.fileUtils = new ArmorBuildFileUtils();
		this.run = new ArmorBuildRun(events, this.config);
		this.clean = new ArmorBuildClean(events, this.config);
		this.create = new ArmorBuildCreate(events, this.config);
	}

	public parseArgs(): ArmorBuildConfig {
		if (!yargs) {
			throw new Error('Failed parsing args - could not find yargs npm package.');
		}

		const argv = yargs.argv;
		const config = new ArmorBuildConfig();

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

	public getContents(path: string, options?: ArmorBuildFilesGetContentsOptions): Promise<string | Error> {
		return this.fileUtils.getContents(path, options);
	}
}
