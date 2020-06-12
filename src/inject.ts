import * as nunjucksRender from 'gulp-nunjucks-render';

import { dest, src } from 'gulp';

import {ArmorBuildConfig} from './config';
import {EventEmitter} from 'events';

export class ArmorBuildInject {
	public readonly events: EventEmitter;
	public readonly config: ArmorBuildConfig;

	constructor(events: EventEmitter, config: ArmorBuildConfig) {
		if (!events) {
			throw new Error('Armor Build (inject) init failed - events argument missing in constructor.');
		}

		if (!config) {
			throw new Error('Armor Build (inject) init failed - config argument missing in constructor.');
		}

		this.events = events;
		this.config = config;
	}

	public async content(content: string, templatePath: string, srcPattern: string, dstPath: string): Promise<any> {
		return src(srcPattern)
			.pipe(nunjucksRender({
				path: [templatePath]
			}))
			.pipe(dest(dstPath));
	}
}
