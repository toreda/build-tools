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

import type {FileOptions} from './options';
import {readFile} from 'fs-extra';

/**
 * Get file contents as a string for target file found at `filePath`.
 * @param filePath
 * @param options
 * @returns			File contents as string when file is found at filePath, or null file is not found,
 *					or the file could not be read due to permissions, or other errors.
 *
 * @category Files
 */
export async function fileContents(filePath: string, options?: FileOptions): Promise<string | null> {
	const encoding = options && typeof options.encoding === 'string' ? options.encoding : 'utf8';

	return new Promise((resolve, reject) => {
		readFile(filePath, encoding, (err, data: string) => {
			if (err) {
				return reject(
					new Error(`Build failed to get file contents from '${filePath}' - ${err.message}.`)
				);
			}

			if (typeof data !== 'string') {
				return resolve(null);
			}

			resolve(data);
		});
	});
}
