import {StrongMap, StrongString, makeString} from '@toreda/strong-types';

import {BuildOptions} from './build/options';
import {Defaults} from './defaults';
import {WebpackOptions} from './webpack/options';

export class Config extends StrongMap {
	public readonly env: StrongString;

	constructor(options?: BuildOptions) {
		super();
		this.env = makeString('dev');

		this.parse(options);
	}

	public getWebpackCfgPath(options: WebpackOptions): string {
		if (this.env() === 'dev') {
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
