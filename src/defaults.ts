/**
 * Package-wide default values used when no other value is provided.
 *
 * @category Config
 */
export class Defaults {
	public static Webpack = {
		CfgPathDev: './webpack.dev.js',
		CfgPathProd: './webpack.prod.js'
	} as const;
}
