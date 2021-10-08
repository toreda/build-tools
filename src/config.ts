import {BuildMode} from './build/mode';
import {BuildOptions} from './build/options';
import {CliArgs} from '.';
import {Defaults} from './defaults';
import {Log} from '@toreda/log';
import {WebpackOptions} from './webpack/options';

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
	public readonly mockOperations: boolean;
	public readonly log: Log;

	constructor(args: CliArgs, options: BuildOptions, baseLog: Log) {
		this.log = baseLog.makeLog('Config');
		this.buildMode = this.makeBuildMode(args, options);
		this.profiler = this.makeProfiler(args, options);
		this.mockOperations = this.makeMockOnly(args, options);
	}

	public makeMockOnly(args: CliArgs, options: BuildOptions): boolean {
		if (typeof args.mockOperations === 'boolean') {
			return args.mockOperations;
		}

		if (typeof options.mockOperations === 'boolean') {
			return options.mockOperations;
		}

		return Defaults.MockOperations;
	}

	public makeProfiler(args: CliArgs, options: BuildOptions): boolean {
		if (typeof args?.profiler === 'boolean') {
			return args.profiler;
		}

		if (typeof options?.profiler === 'boolean') {
			return options?.profiler;
		}

		return Defaults.ProfilerEnabled;
	}

	public makeBuildMode(args: CliArgs, options: BuildOptions): BuildMode {
		if (args.env === 'dev' || args.env === 'prod') {
			return args.env;
		}

		if (options.env === 'dev' || options.env === 'prod') {
			return options.env;
		}

		return Defaults.BuildMode;
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
