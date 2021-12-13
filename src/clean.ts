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

import {Config} from './config';
import {EventEmitter} from 'events';
import {Log} from '@toreda/log';
import {dirDelete} from './dir/delete';

/**
 * Rrecursively clean files and dirs in output folder and intermediate
 * build folders.
 *
 * @category Clean
 */
export class Clean {
	public readonly events: EventEmitter;
	public readonly cfg: Config;
	public readonly log: Log;

	constructor(cfg: Config, events: EventEmitter, log: Log) {
		this.events = events;
		this.cfg = cfg;
		this.log = log.makeLog('Clean');
	}

	/**
	 * Clean target directory, recursively removing all files
	 * and directories.
	 * @param path
	 * @param force
	 * @returns
	 */
	public dir(path: string, force?: boolean): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			if (typeof path !== 'string') {
				return reject(new Error('cleanDir failure - path is not a valid string.'));
			}

			const cleanPath = path.trim();
			if (cleanPath === '') {
				return reject(new Error('cleanDir failure - path cannot be an empty string.'));
			}

			if (!force) {
				if (cleanPath === '.' || cleanPath === '/' || cleanPath === './' || cleanPath === '../') {
					return reject(
						new Error(
							`cleanDir - '${cleanPath}' is a protected path. Set the 'force' argument true to override this safety.`
						)
					);
				}
			}

			try {
				await dirDelete(this.cfg, cleanPath);
			} catch (e) {
				return reject(e);
			}

			return resolve(true);
		});
	}

	/**
	 * Alias for clean dir.
	 * @param path
	 * @param force
	 * @returns
	 */
	public folder(path: string, force?: boolean): Promise<boolean> {
		return this.dir(path, force);
	}
}
