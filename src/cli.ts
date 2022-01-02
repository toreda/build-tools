import {CliArgs} from './cli/args';
import {Log} from '@toreda/log';
import yargs from 'yargs';

/**
 * CLI functionality used when package is called via command line. Not used
 * when importing classes as an NPM package.
 *
 * @category CLI
 */
export class Cli {
	public readonly log: Log;

	constructor(baseLog: Log) {
		this.log = baseLog.makeLog('Cli');
	}

	public getArgs(): CliArgs {
		return yargs(process.argv.slice(2)).options({
			autoMockInJest: {
				demand: false,
				type: 'boolean',
				default: true,
				describe: 'Automatically enable mocks for file operations when Jest is running.'
			},
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
			},
			debugMode: {
				type: 'boolean',
				default: false,
				demand: false,
				describe:
					'Enable debug logging and debug data & symbols in webpacking. Disable for production builds.'
			},
			mockAll: {
				type: 'boolean',
				default: false,
				demand: false,
				describe: 'Enable all mocks. Individual mock flags are ignored when true.'
			},
			mockFileReads: {
				type: 'boolean',
				default: false,
				demand: false,
				describe:
					'Use mocks for file reading instead of real file calls. Cannot read real files while active.'
			},
			mockFileWrites: {
				type: 'boolean',
				default: false,
				demand: false,
				describe:
					'Replace file write calls with mocks that return a specified value. Cannot write to real files while active.'
			}
		}).argv as CliArgs;
	}
}
