import {BuildOptions} from './build/options';
import {Defaults} from './defaults';
import {WebpackOptions} from './webpack/options';

/**
 * Configuration created from initial build options. All properties are guaranteed to
 * exist and be the expected types.
 *
 * @category Config
 */
export class Config {
	public env: string;

	constructor(options?: BuildOptions) {
		this.env = 'dev';

		if (options && typeof options.env === 'string') {
			this.env = options.env;
		}
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
