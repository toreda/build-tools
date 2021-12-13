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

import {ESLint} from 'eslint';
import type {LinterFormatterId} from './formatter/id';

/**
 * Optional arguments used by a single lint operation. Top level options validated before
 * use, while `eslint` options pass directly to the linter without validation.
 *
 * @category Linter
 */
export interface LinterOptions extends ESLint.Options {
	/** Should linter run in quiet mode and suppress warning & error output? */
	quiet?: boolean;
	/** ID of lint formatter to use when formatting linter output. */
	formatterId?: LinterFormatterId;
	/** ESLint options passed directly to ESLint operation. */
	eslint?: ESLint.Options;
	/** Should linter automatically fix any warnings or errors considerd 'fixable'? */
	autofix?: boolean;
}
