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

import {ESLint, Linter, Rule} from 'eslint';

import type {BaseObject} from '@toreda/types';
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
	public readonly useEslintrc?: boolean;
	public readonly cache: boolean;
	public readonly cacheStrategy?: 'content' | 'metadata';
	public readonly cacheLocation?: string;
	public readonly globInputPaths?: boolean;
	public readonly ignore?: boolean;
	public readonly ignorePath?: string;
	public readonly extensions?: string[];
	public readonly fix?: boolean | ((message: Linter.LintMessage) => boolean);
	public readonly fixTypes?: Array<Rule.RuleMetaData['type']>;
	public readonly rulePaths?: string[];
	public readonly resolvePluginsRelativeTo?: string;
	public readonly plugins?: Record<string, unknown>;
	public readonly baseConfig?: Linter.Config;
	public readonly overrideConfig?: Linter.Config;
	public readonly overrideConfigFile?: string;
	public readonly reportUnusedDisableDirectives?: boolean;

	constructor(o?: Partial<LinterOptions>) {
		this.quiet = typeof o?.quiet === 'boolean' ? o?.quiet : false;
		this.autofix = typeof o?.autofix === 'boolean' ? o?.autofix : false;
		this.cwd = typeof o?.cwd === 'string' ? o?.cwd : undefined;
		this.allowInlineConfig = typeof o?.allowInlineConfig === 'boolean' ? o?.allowInlineConfig : false;
		this.useEslintrc = typeof o?.useEslintrc === 'boolean' ? o?.useEslintrc : true;
		this.cache = typeof o?.cache === 'boolean' ? o?.cache : false;
		this.globInputPaths = typeof o?.globInputPaths === 'boolean' ? o?.globInputPaths : undefined;
		this.ignorePath = typeof o?.ignorePath === 'string' ? o?.ignorePath : undefined;
		this.extensions = Array.isArray(o?.extensions) ? o?.extensions : undefined;
		this.cacheLocation = typeof o?.cacheLocation === 'string' ? o?.cacheLocation : undefined;
		this.fixTypes = Array.isArray(o?.fixTypes) ? o?.fixTypes : undefined;
		this.rulePaths = Array.isArray(o?.rulePaths) ? o?.rulePaths : undefined;
		this.resolvePluginsRelativeTo =
			typeof o?.resolvePluginsRelativeTo === 'string' ? o?.resolvePluginsRelativeTo : undefined;
		this.plugins = this.mkPlugins(o?.plugins);
		this.baseConfig = this.mkConfig(o?.baseConfig);
		this.overrideConfig = this.mkConfig(o?.overrideConfig);
		this.cacheStrategy =
			o?.cacheStrategy === 'content' || o?.cacheStrategy === 'metadata' ? o?.cacheStrategy : undefined;
		this.overrideConfigFile =
			typeof o?.overrideConfigFile === 'string' ? o?.overrideConfigFile : undefined;
		this.ignore = typeof o?.ignore === 'boolean' ? o?.ignore : false;
		this.reportUnusedDisableDirectives =
			typeof o?.reportUnusedDisableDirectives === 'boolean'
				? o?.reportUnusedDisableDirectives
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
			allowInlineConfig: this.allowInlineConfig,
			useEslintrc: this.useEslintrc,
			ignorePath: this.ignorePath,
			extensions: this.extensions,
			cacheLocation: this.cacheLocation,
			fixTypes: this.fixTypes
		};
	}
}
