import {ESLint, Linter, Rule} from 'eslint';

import {LinterOptions} from '../linter/options';

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
	public readonly reportUnusedDisableDirectives?: Linter.RuleLevel;

	constructor(o?: LinterOptions) {
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
		this.resolvePluginsRelativeTo = typeof o?.resolvePluginsRelativeTo
			? o?.resolvePluginsRelativeTo
			: undefined;
		this.plugins = o?.plugins ? o.plugins : undefined;
		this.baseConfig = o?.baseConfig ? o?.baseConfig : undefined;
		this.overrideConfig = o?.overrideConfig ? o?.overrideConfig : undefined;
		this.overrideConfigFile =
			typeof o?.overrideConfigFile === 'string' ? o?.overrideConfigFile : undefined;
		this.ignore = typeof o?.ignore === 'boolean' ? o?.ignore : false;
		this.reportUnusedDisableDirectives =
			typeof o?.reportUnusedDisableDirectives === 'string' ||
			typeof o?.reportUnusedDisableDirectives === 'number'
				? o.reportUnusedDisableDirectives
				: 'warn';
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
