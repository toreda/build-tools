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

import {ESLint, Linter} from 'eslint';

import type {BaseObject} from '@toreda/shared-types';
import type {LinterOptions} from '../linter/options';

/**
 * Managed config data for a single linter execution.
 *
 * @category Linter
 */
export class ConfigLinter {
	public readonly quiet: boolean;
	public readonly autofix: boolean;
	public readonly cwd?: string;
	public readonly allowInlineConfig: boolean;
	public readonly cache: boolean;
	public readonly cacheStrategy?: 'content' | 'metadata';
	public readonly cacheLocation?: string;
	public readonly globInputPaths?: boolean;
	public readonly ignore?: boolean;
	public readonly ignorePatterns?: string[];
	public readonly fix?: boolean | ((message: Linter.LintMessage) => boolean);
	public readonly fixTypes?: ESLint.Options['fixTypes'];
	public readonly plugins?: Record<string, unknown>;
	public readonly baseConfig?: Linter.Config;
	public readonly overrideConfig?: Linter.Config;
	public readonly overrideConfigFile?: string | true;

	constructor(o?: Partial<LinterOptions>) {
		this.quiet = typeof o?.quiet === 'boolean' ? o?.quiet : false;
		this.autofix = typeof o?.autofix === 'boolean' ? o?.autofix : false;
		this.cwd = typeof o?.cwd === 'string' ? o?.cwd : undefined;
		this.allowInlineConfig = typeof o?.allowInlineConfig === 'boolean' ? o?.allowInlineConfig : false;
		this.cache = typeof o?.cache === 'boolean' ? o?.cache : false;
		this.globInputPaths = typeof o?.globInputPaths === 'boolean' ? o?.globInputPaths : undefined;
		this.ignore = typeof o?.ignore === 'boolean' ? o?.ignore : undefined;
		this.ignorePatterns = Array.isArray(o?.ignorePatterns) ? o?.ignorePatterns : undefined;
		this.cacheLocation = typeof o?.cacheLocation === 'string' ? o?.cacheLocation : undefined;
		this.fix = typeof o?.fix === 'boolean' || typeof o?.fix === 'function' ? o?.fix : undefined;
		this.fixTypes = Array.isArray(o?.fixTypes) ? o?.fixTypes : undefined;
		this.plugins = this.mkPlugins(o?.plugins);
		this.baseConfig = this.mkConfig(o?.baseConfig);
		this.overrideConfig = this.mkConfig(o?.overrideConfig);
		this.cacheStrategy =
			o?.cacheStrategy === 'content' || o?.cacheStrategy === 'metadata' ? o?.cacheStrategy : undefined;
		this.overrideConfigFile =
			typeof o?.overrideConfigFile === 'string' || o?.overrideConfigFile === true
				? o?.overrideConfigFile
				: undefined;
	}

	public mkConfig(o?: unknown): Record<string, unknown> | undefined {
		if (!o) {
			return undefined;
		}

		if (Array.isArray(o) || typeof o !== 'object') {
			return undefined;
		}

		return o as BaseObject;
	}

	public mkPlugins(o?: unknown): Record<string, unknown> | undefined {
		if (!o) {
			return undefined;
		}

		if (Array.isArray(o)) {
			return undefined;
		}

		if (typeof o !== 'object') {
			return undefined;
		}

		return o as BaseObject;
	}

	public eslintOptions(): ESLint.Options {
		return {
			cwd: this.cwd,
			globInputPaths: this.globInputPaths,
			cache: this.cache,
			cacheStrategy: this.cacheStrategy,
			cacheLocation: this.cacheLocation,
			allowInlineConfig: this.allowInlineConfig,
			ignore: this.ignore,
			ignorePatterns: this.ignorePatterns,
			fix: this.fix !== undefined ? this.fix : this.autofix,
			fixTypes: this.fixTypes,
			baseConfig: this.baseConfig,
			overrideConfig: this.overrideConfig,
			overrideConfigFile: this.overrideConfigFile,
			plugins: this.plugins as ESLint.Options['plugins']
		};
	}
}
