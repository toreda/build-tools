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

import {existsSync, mkdirSync} from 'fs-extra';

import {Config} from '../config';
import type {FileOptions} from '../file/options';
import {jestEnv} from '../jest/env';

/**
 * Create directory at target path. Fails when
 * @param path
 * @param options
 * @returns
 *
 * @category Files
 */
export async function dirCreate(cfg: Config, path: string, options?: FileOptions): Promise<boolean> {
	const overwrite = typeof options?.overwrite === 'boolean' ? options?.overwrite : false;

	if (!cfg) {
		return false;
	}

	const autoMock = cfg.autoMockInJest && jestEnv();
	const mockReads = autoMock || cfg.mocks.all || cfg.mocks.fileReads;
	const mockWrites = autoMock || cfg.mocks.all || cfg.mocks.fileWrites;

	return new Promise((resolve, reject) => {
		if (typeof path !== 'string') {
			reject(new Error('Failed to createFolder during build - path argument was not a valid string.'));
		}

		// Assume success & return before the existSync read when read ops are mocked.
		if (mockReads) {
			return resolve(true);
		}

		if (existsSync(path)) {
			if (overwrite !== true) {
				return reject(new Error('createFolder failed during build - folder exists at path.'));
			} else {
				return resolve(true);
			}
		}

		// Assume success & return when write ops are mocked.
		if (mockWrites) {
			return resolve(true);
		}

		mkdirSync(path);

		return resolve(true);
	});
}
