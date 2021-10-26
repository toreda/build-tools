import {BuildMode} from './build/mode';
import {BuildOptions} from './build/options';
import {CliArgs} from '.';
import {ConfigLinter} from './config/linter';
import {ConfigMocks} from './config/mocks';
import {Defaults} from './defaults';
import {Log} from '@toreda/log';
import {WebpackOptions} from './webpack/options';
import {configBoolean} from './config/boolean';
import {configValue} from './config/value';

/**
 * Configuration created from initial build options. All properties are guaranteed to
 * exist and be the expected types.
 *
 * @category Config
 */
export class Config {
	public readonly entry: string;
	public readonly buildMode: BuildMode;
	public readonly profiler: boolean;
	public readonly log: Log;
	public readonly debugMode: boolean;
	public readonly mocks: ConfigMocks;
	public readonly autoMockInJest: boolean;
	public readonly linter: ConfigLinter;

	constructor(args: CliArgs, options: BuildOptions, baseLog: Log) {
		this.log = baseLog.makeLog('Config');
		this.buildMode = configValue<BuildMode>('buildMode', 'prod', args, options);
		this.profiler = configBoolean('profiler', false, args, options);

		this.mocks = {
			all: configBoolean('mockAll', false, args, options),
			fileReads: configBoolean('mockFileReads', false, args, options),
			fileWrites: configBoolean('mockFileWrites', false, args, options)
		};
		this.debugMode = configBoolean('debugMode', false, args, options);
		this.autoMockInJest = configBoolean('autoMockInJest', true, args, options);

		this.linter = new ConfigLinter(options?.linter);
	}

	/**
	 * Get path to webpack config file based on current build env. Uses paths
	 * from provided options, but falls back to global Defaults when path option
	 * is provided for current env.
	 * @param options
	 * @returns
	 */
	public getWebpackCfgPath(options: WebpackOptions): string {
		if (this.buildMode === 'dev') {
			if (typeof options.cfgPathDev === 'string') {
				return options.cfgPathDev;
			} else {
				return Defaults.Webpack.CfgPathDev;
			}
		} else {
			if (typeof options.cfgPathProd === 'string') {
				return options.cfgPathProd;
			} else {
				return Defaults.Webpack.CfgPathProd;
			}
		}
	}
}
