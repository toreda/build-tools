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
import {esmImports} from './imports';
import {promises as fs} from 'fs';

async function rewriteDir(dir: string, exts: string[], options?: EsmOptions): Promise<void> {
	const entries = await fs.readdir(dir, {withFileTypes: true});

	for (const entry of entries) {
		const entryPath = Path.join(dir, entry.name);

		if (entry.isDirectory()) {
			await rewriteDir(entryPath, exts, options);
			continue;
		}

		const ext = exts.find((fileExt) => entry.name.endsWith(fileExt));

		if (!ext) {
			continue;
		}

		const contents = await fs.readFile(entryPath, 'utf8');
		const updated = esmImports(contents, dir, ext, options);

		if (updated !== contents) {
			await fs.writeFile(entryPath, updated, 'utf8');
		}
	}
}

/**
 * Finalize dual ESM + CJS output dirs after transpiling. Fixes ESM import specifiers and
 * makes each output dir self-describing, so Node picks the right module system regardless
 * of the `type` field in the root package.json.
 * @param esmDir		Dir containing transpiled ES module output.
 * @param cjsDir		Dir containing transpiled CommonJS output. Skipped when not provided.
 * @param options		Overrides for which fixes run, and how specifiers are rewritten.
 *
 * @category ESM
 */
export async function esmFinalize(
	esmDir: string,
	cjsDir?: string | null,
	options?: EsmOptions
): Promise<void> {
	const rewriteImports = options?.rewriteImports ?? esmDefaults.rewriteImports;
	const packageTypes = options?.packageTypes ?? esmDefaults.packageTypes;

	if (rewriteImports) {
		const extMap = options?.extMap ?? esmDefaults.extMap;
		// Longest extensions match first so '.d.ts' is not mistaken for a shorter extension.
		const exts = Object.keys(extMap).sort((a, b) => b.length - a.length);

		await rewriteDir(Path.resolve(esmDir), exts, options);
	}

	if (!packageTypes) {
		return;
	}

	await fs.writeFile(
		Path.resolve(esmDir, 'package.json'),
		JSON.stringify({type: 'module'}, null, '\t') + '\n'
	);

	if (typeof cjsDir === 'string') {
		await fs.writeFile(
			Path.resolve(cjsDir, 'package.json'),
			JSON.stringify({type: 'commonjs'}, null, '\t') + '\n'
		);
	}
}

/**
 * Finalize CJS output when no ESM output is built. Makes the output dir self-describing,
 * so Node reads it as CommonJS regardless of the `type` field in the root package.json.
 * @param cjsDir		Dir containing transpiled CommonJS output.
 * @param options		Set `packageTypes` to `false` to skip writing package.json.
 *
 * @category ESM
 */
export async function cjsFinalize(cjsDir: string, options?: EsmOptions): Promise<void> {
	const packageTypes = options?.packageTypes ?? esmDefaults.packageTypes;

	if (!packageTypes) {
		return;
	}

	await fs.writeFile(
		Path.resolve(cjsDir, 'package.json'),
		JSON.stringify({type: 'commonjs'}, null, '\t') + '\n'
	);
}
