const nunjucksRender = require('gulp-nunjucks-render');

import {dest, src} from 'gulp';

import {BuildState} from './state';
import {EventEmitter} from 'events';

export class BuildInject {
	public readonly events: EventEmitter;
	public readonly state: BuildState;

	constructor(events: EventEmitter, state: BuildState) {
		if (!events) {
			throw new Error('BuildInject init failure - events argument missing in constructor.');
		}

		if (!state) {
			throw new Error('BuildInject init failure - state argument missing in constructor.');
		}

		this.events = events;
		this.state = state;
	}

	public async content(
		content: string,
		templatePath: string,
		srcPattern: string,
		dstPath: string
	): Promise<any> {
		return src(srcPattern)
			.pipe(
				nunjucksRender({
					path: [templatePath]
				})
			)
			.pipe(dest(dstPath));
	}
}
