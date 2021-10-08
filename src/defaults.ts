import {BuildMode} from './build/mode';

/**
 * Package-wide default values used when no other value is provided.
 *
 * @category Config
 */
export class Defaults {
	public static BuildMode: BuildMode = 'prod' as const;
	public static ProfilerEnabled = false as const;
	public static Webpack = {
		CfgPathDev: './webpack.dev.js',
		CfgPathProd: './webpack.prod.js'
	} as const;
}
