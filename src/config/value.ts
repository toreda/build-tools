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

import type {BuildOptions} from '../build/options';
import type {CliArgs} from '../cli/args';

/**
 * Get config key from args and check type, then from options when no match is found.
 * @param key			keyname of property to search for in CliArgs and BuildOptions.
 * @param type			JavaScript type name used to validate value.
 * @param args			CliArgs object to check.
 * @param options		BuildOptions object to check.
 * @returns				T		-	Key value of type T when match is found.
 *						null	-	No key values were found matching type.
 *
 * @category Config
 */
export function configValue<T>(key: string, fallback: T, args?: CliArgs, options?: BuildOptions): T {
	if (typeof key !== 'string' || !key) {
		return fallback;
	}

	const type = typeof fallback;

	if (args && typeof args[key] === type) {
		// Safe cast when typeof fallback matches T.
		return args[key] as T;
	}

	if (options && typeof options[key] === type) {
		// Safe cast when typeof fallback matches T.
		return options[key] as T;
	}

	return fallback;
}
