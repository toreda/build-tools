import * as yargs from 'yargs';

import {ArmorBTConfig} from './config';
import {ArmorBTGulp} from './gulp';
import {EventEmitter} from 'events';
import Path from 'path';

// tslint:disable-next-line
const webpack = require('webpack');

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

	public webpack(customPath?: string): Promise<any> {
		const standardPath = this.config.env === 'dev' ? './webpack.dev.js' : './webpack.prod.js';
		const configJsonPath = customPath ? customPath : standardPath;
		const resolvedPath = Path.resolve(standardPath);

		return new Promise((resolve, reject) => {
			import(resolvedPath).then((webpackConfig) => {
				console.log(' @@@@@@ config: ' + JSON.stringify(webpackConfig));
				webpack(webpackConfig, (err, stats) => {
					if (err) {
						console.error(`webpack build failed: ${err.message}.`);
						return reject(err);
					}

					if (stats.hasErrors()) {
						console.error('webpack build error: ');
						stats.compilation.errors.forEach((error) => {
							console.error(error);
						});
						return reject(stats.compilation.errors.join('\n'));
					}

					resolve();
				});
			});
		});
	}
}
