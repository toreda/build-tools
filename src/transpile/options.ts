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

import type {EsmOptions} from '../esm/options';
import type {Settings} from 'gulp-typescript';

/**
 * Options shared by all transpile steps. All options are optional. Options prefixed
 * with a format key only apply to that format. e.g. `esmModule` only applies to ESM output.
 *
 * @category TypeScript
 */
export interface TranspileOptions {
	/** Root output dir. Each format's output dir is created inside. Defaults to `./dist`. */
	outDir?: string;
	/** Name of the CJS output dir inside `outDir`. Defaults to `cjs`. Use an empty string
	 *  to write CJS output directly to `outDir`, e.g. when only one format is built. */
	cjsDirName?: string;
	/** Name of the ESM output dir inside `outDir`. Defaults to `esm`. Use an empty string
	 *  to write ESM output directly to `outDir`, e.g. when only one format is built. */
	esmDirName?: string;
	/** Path to tsconfig used for formats without their own tsconfig path. Defaults to `./tsconfig.json`. */
	tsConfigPath?: string;
	/** Path to tsconfig used for CJS output. When not provided, `tsConfigPath` is
	 *  used with `module` overridden by `cjsModule`. */
	cjsTsConfigPath?: string;
	/** Path to tsconfig used for ESM output. When not provided, `tsConfigPath` is
	 *  used with `module` overridden by `esmModule`. */
	esmTsConfigPath?: string;
	/** Module format for CJS output when `cjsTsConfigPath` is not provided. Defaults to `commonjs`. */
	cjsModule?: string;
	/** Module format for ESM output when `esmTsConfigPath` is not provided. Defaults to `es2020`. */
	esmModule?: string;
	/** Glob patterns matching source files to transpile. Defaults to `filesGlob` in the
	 *  tsconfig, then all `.ts` files in `./src` when the tsconfig has no `filesGlob`. */
	srcPatterns?: string[];
	/** Compiler options applied on top of the tsconfig for CJS output. Applied after `cjsModule`. */
	cjsCompilerOptions?: Settings;
	/** Compiler options applied on top of the tsconfig for ESM output. Applied after `esmModule`. */
	esmCompilerOptions?: Settings;
	/** Re-emit declaration files with comments intact after transpiling, so consumers keep JSDoc
	 *  hover docs. `true` always re-emits and `false` never does. When not provided, declarations
	 *  are re-emitted only when the tsconfig sets `removeComments` or `typesTsConfigPath` is provided. */
	declarationComments?: boolean;
	/** Path to tsconfig used when re-emitting declarations. Defaults to the tsconfig
	 *  used to transpile the format. */
	typesTsConfigPath?: string;
	/** Additional `tsc` command line args used when re-emitting declarations. */
	typesTscArgs?: string[];
	/** Path to the `tsc` script used when re-emitting declarations. Defaults to the `typescript`
	 *  package resolved from the current working dir. */
	tscPath?: string;
	/** Controls fixes applied to output after transpiling: import specifier rewriting
	 *  and `package.json` module type files. */
	finalize?: EsmOptions;
}
