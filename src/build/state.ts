import {StrongMap, StrongString, makeString} from '@toreda/strong-types';

import {BuildOptions} from './options';

export class BuildState extends StrongMap {
	public env: StrongString;

	constructor(options?: BuildOptions) {
		super();

		this.env = makeString('dev', 'dev');

		this.parse(options);
	}
}
