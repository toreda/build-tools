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

/**
 * Options controlling how ESM output is fixed up to load in Node. All options are
 * optional. Defaults suit typescript output using `.js` and `.d.ts` files.
 *
 * @category ESM
 */
export interface EsmOptions {
	/** Maps the extension of each file type to rewrite, to the extension appended to relative
	 *  specifiers found in it. The key is also used to find import targets on disk. Files
	 *  with extensions not in the map are left unchanged.
	 *  Defaults to `{'.js': '.js', '.d.ts': '.js'}`. Projects emitting `.mjs` could use
	 *  `{'.mjs': '.mjs', '.d.mts': '.mjs'}`. */
	extMap?: Record<string, string>;
	/** Specifiers already ending in one of these extensions are left unchanged.
	 *  Defaults to `['.js', '.mjs', '.cjs', '.json', '.node']`. */
	resolvedExts?: string[];
	/** Base name of the file a directory import resolves to. Defaults to `index`. */
	indexName?: string;
	/** Rewrite relative import specifiers in ESM output. Defaults to `true`. */
	rewriteImports?: boolean;
	/** Write a `package.json` with the module `type` to each output dir. Defaults to `true`. */
	packageTypes?: boolean;
}
