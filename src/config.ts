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
	public readonly log: Log;

	constructor(args: CliArgs, options: BuildOptions, baseLog: Log) {
		this.log = baseLog.makeLog('Config');
		this.buildMode = this.makeBuildMode(args);
		this.profiler = this.makeProfiler(args);
	}

	public makeProfiler(args: CliArgs): boolean {
		if (!args || typeof args.profiler !== 'boolean') {
			return Defaults.ProfilerEnabled;
		}

		return args.profiler;
	}

	public makeBuildMode(args: CliArgs): BuildMode {
		if (!args || typeof args.buildMode !== 'string') {
			return Defaults.BuildMode;
		}

		const lower = args.buildMode.toLowerCase();
		if (lower !== 'dev' && lower !== 'prod') {
			return Defaults.BuildMode;
		}

		return lower;
	}

	/**
	 * Get path to webpack config file based on current build env. Uses paths
	 * from provided options, but falls back to global Defaults when path option
	 * is provided for current env.
	 * @param options
	 * @returns
	 */
	public getWebpackCfgPath(options: WebpackOptions): string {
		if (this.env === 'dev') {
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
