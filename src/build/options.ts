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

import type {BuildWebpackOptions} from './webpack/options';
import {EventEmitter} from 'events';
import type {LinterOptions} from '../linter/options';
import {Log} from '@toreda/log';
import type {LogOptionsGlobal} from '@toreda/log';

/**
 * Options used by Build on instantiation to seed initial objects
 * and settings.
 */
export interface BuildOptions {
	[k: string]: unknown;
	/** Global event emitter instance. Created in Build when not provided. */
	events?: EventEmitter;
	/** Development environment type.
	 * 	dev	-	Development env. Extra debugging, logging, and options enabled
	 *			by default. Additional debug symbols and data packed into bundles.
	 *	prod -	Production env. Optimized for error checking, completeness, and final
	 *			bundle or package size. Slower builds due to minification & cleanup.
	 *	qa
	 */
	env?: string;
	/** Global logging instance for debugging. Log output to console disabled by default */
	log?: Log | LogOptionsGlobal;
	/** Options for webpack build. Deefaults */
	webpack?: BuildWebpackOptions;
	autoMockInJest?: boolean;
	profiler?: boolean;
	mockAll?: boolean;
	mockFileReads?: boolean;
	mockFileWrites?: boolean;
	debugMode?: boolean;
	linter?: LinterOptions;
}
