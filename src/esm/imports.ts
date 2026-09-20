/**
 *	MIT License
 *
 *	Copyright (c) 2019 - 2026 Toreda, Inc.
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
import type {EsmOptions} from './options';
import {esmSpecifier} from './specifier';

/**
 * Matches relative specifiers in static imports & exports (`from './x'`), side effect
 * imports (`import './x'`), and dynamic imports with literal args (`import('./x')`).
 */
const SPECIFIER_PATTERN = /(\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]*)\2/g;

/**
 * Rewrite all relative import specifiers in file contents to include file extensions.
 * @param contents		Contents of an emitted file. e.g. `.js` or `.d.ts`
 * @param fileDir		Dir containing the file.
 * @param ext			Extension of the file contents were read from.
 * @param options		Overrides for extensions and index file name.
 * @returns				Contents with rewritten specifiers.
 *
 * @category ESM
 */
export function esmImports(contents: string, fileDir: string, ext: string, options?: EsmOptions): string {
	if (typeof contents !== 'string') {
		return contents;
	}

	return contents.replace(SPECIFIER_PATTERN, (_match, prefix, quote, specifier) => {
		return `${prefix}${quote}${esmSpecifier(fileDir, specifier, ext, options)}${quote}`;
	});
}
