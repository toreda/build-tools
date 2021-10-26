import {BuildWebpackOptions} from './webpack/options';
import {EventEmitter} from 'events';
import {LinterOptions} from '../linter/options';
import {Log} from '@toreda/log';

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
	log?: Log;
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
