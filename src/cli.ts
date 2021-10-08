import {CliArgs} from '.';
import {Log} from '@toreda/log';
import yargs from 'yargs';

export class Cli {
	public readonly log: Log;

	constructor(baseLog: Log) {
		this.log = baseLog.makeLog('Cli');
	}

	public getArgs(): CliArgs {
		return yargs(process.argv.slice(2)).options({
			env: {
				choices: ['prod', 'dev'],
				demand: false,
				default: 'prod',
				describe: 'Target build type or build environment.'
			},
			profiler: {
				type: 'boolean',
				default: false,
				demand: false,
				describe: 'Run profiler. Slows build, but produces a detailed CPU usage report'
			}
		}).argv as CliArgs;
	}
}
