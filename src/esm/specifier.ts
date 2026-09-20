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
import Path from 'path';
import {esmDefaults} from './defaults';
import {existsSync} from 'fs';

/**
 * Resolve an extensionless relative import specifier to the full path Node requires
 * in ES modules. Typescript emits specifiers as written in source, but Node's ESM
 * resolver does not guess file extensions or resolve directory indexes.
 *
 * Files are checked before directories to match typescript resolution when
 * both `./name.ts` and `./name/index.ts` exist.
 * @param fileDir		Dir containing the file the specifier was found in.
 * @param specifier		Relative import specifier as emitted. e.g. `./config`
 * @param ext			Extension of the file being rewritten (e.g. `.js` or `.d.ts`). Used to
 *						find the import target on disk, and to look up the extension
 *						appended to the specifier in `options.extMap`. By default both
 *						`.js` and `.d.ts` files get `.js` specifiers.
 * @param options		Overrides for extensions and index file name.
 * @returns				Specifier with extension, or the unchanged specifier when it
 *						already resolves, no matching target exists, or `ext` is not
 *						in `options.extMap`.
 *
 * @category ESM
 */
export function esmSpecifier(fileDir: string, specifier: string, ext: string, options?: EsmOptions): string {
	if (typeof specifier !== 'string' || !/^\.{1,2}\//.test(specifier)) {
		return specifier;
	}

	const extMap = options?.extMap ?? esmDefaults.extMap;
	const resolvedExts = options?.resolvedExts ?? esmDefaults.resolvedExts;
	const indexName = options?.indexName ?? esmDefaults.indexName;
	const appendExt = extMap[ext];

	if (typeof appendExt !== 'string') {
		return specifier;
	}

	if (resolvedExts.some((resolvedExt) => specifier.endsWith(resolvedExt))) {
		return specifier;
	}

	const target = Path.resolve(fileDir, specifier);

	if (existsSync(target + ext)) {
		return `${specifier}${appendExt}`;
	}

	if (existsSync(Path.join(target, `${indexName}${ext}`))) {
		return `${specifier.replace(/\/$/, '')}/${indexName}${appendExt}`;
	}

	return specifier;
}
