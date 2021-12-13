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

import {Config} from '../config';
import {filePath} from '../file/path';
import {jestEnv} from '../jest/env';
import {remove} from 'fs-extra';

/**
 * Delete target directory
 * @param input			File path of directory to delete.
 * @returns
 *
 * @category Files
 */
export async function dirDelete(cfg: Config, input: string): Promise<boolean | Error> {
	if (!cfg) {
		return false;
	}

	const path = filePath(input);

	const autoMock = cfg.autoMockInJest && jestEnv();
	const mockWrites = autoMock || cfg.mocks.all || cfg.mocks.fileWrites;

	if (path === null) {
		throw new Error('Bad path format or missing path in dir delete');
	}

	return new Promise((resolve, reject) => {
		if (mockWrites) {
			return resolve(true);
		}

		try {
			remove(path, () => {
				return resolve(true);
			});
		} catch (e) {
			return reject(e);
		}
	});
}
