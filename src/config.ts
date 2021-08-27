import {StrongMap, StrongString, makeString} from '@toreda/strong-types';

import {BuildOptions} from './build/options';

export class Config extends StrongMap {
	public readonly env: StrongString;

	constructor(options?: BuildOptions) {
		super();
		this.env = makeString('dev');

		this.parse(options);
	}
}
