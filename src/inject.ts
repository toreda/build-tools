// eslint-disable-next-line @typescript-eslint/no-var-requires
const nunjucksRender = require('gulp-nunjucks-render');

import {dest, src} from 'gulp';

import {Config} from './config';
import {EventEmitter} from 'events';

export class Inject {
	public readonly events: EventEmitter;
	public readonly cfg: Config;

	constructor(cfg: Config, events: EventEmitter) {
		if (!events) {
			throw new Error('Inject init - events arg missing.');
		}

		if (!cfg) {
			throw new Error('Inject init - cfg arg missing.');
		}

		this.events = events;
		this.cfg = cfg;
	}

	public async content(
		content: string,
		templatePath: string,
		srcPattern: string,
		dstPath: string
	): Promise<NodeJS.ReadWriteStream> {
		return src(srcPattern)
			.pipe(
				nunjucksRender({
					path: [templatePath]
				})
			)
			.pipe(dest(dstPath));
	}
}