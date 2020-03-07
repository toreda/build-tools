import * as yargs from 'yargs';

import {ArmorBTConfig} from './config';
import {ArmorBTGulp} from './gulp';
import {EventEmitter} from 'events';

export class ArmorBuildTools {
	public readonly events: EventEmitter;
	public readonly gulp: ArmorBTGulp;
	public readonly config: ArmorBTConfig;

	constructor(events: EventEmitter) {
		this.events = events;
		this.config = this.parseArgs();
		this.gulp = new ArmorBTGulp(events, this.config);
	}

	public parseArgs(): ArmorBTConfig {
		if (!yargs) {
			throw new Error(`Failed parsing args - could not find yargs npm package.`);
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
}
