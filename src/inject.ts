/**
 *	MIT License
 *
 *	Copyright (c) 2019 - 2022 Toreda, Inc.
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:

 * 	The above copyright notice and this permission notice shall be included in all
 * 	copies or substantial portions of the Software.
 *
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * 	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * 	SOFTWARE.
 *
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nunjucksRender = require('gulp-nunjucks-render');

import {dest, src} from 'gulp';

import {Config} from './config';
import {EventEmitter} from 'events';

/**
 * Inject data and replace values in template files.
 *
 * @category Inject
 */
export class Inject {
	public readonly events: EventEmitter;
	public readonly cfg: Config;

	/**
	 * @param cfg 			Global config instance.
	 * @param events 		Global EventEmitter instance.
	 */
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
