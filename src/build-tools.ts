import * as yargs from 'yargs';

import {AJSBuildToolsConfig} from './config';
import {AJSBuildToolsGulp} from './gulp';
import {EventEmitter} from 'events';

export class AJSBuildTools {
	public readonly events: EventEmitter;
	public readonly gulp: AJSBuildToolsGulp;
	public readonly config: AJSBuildToolsConfig;

	constructor(events: EventEmitter) {
		this.events = events;
		this.config = this.parseArgs();
		this.gulp = new AJSBuildToolsGulp(events, this.config);
	}

	public parseArgs(): AJSBuildToolsConfig {
		if (!yargs) {
			throw new Error(`Failed parsing args - could not find yargs npm package.`);
		}

		const argv = yargs.argv;
		const config: AJSBuildToolsConfig = {};

		return config;
	}
}
