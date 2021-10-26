import {Configuration, WebpackPluginInstance} from 'webpack';

import {Config} from '../../config';

export async function webpackConfigPluginsMake(cfg: Config): Promise<WebpackPluginInstance[]> {
	const plugins: WebpackPluginInstance[] = [];

	return plugins;
}

export function webpackConfigModeMake(cfg: Config): 'development' | 'production' | 'none' {
	switch (cfg.buildMode) {
		case 'dev':
			return 'development';
		case 'prod':
			return 'production';
		// 'production' should always be the default case when nothing else
		// is specified.
		default:
			return 'production';
	}
}

export async function webpackConfigMake(cfg: Config): Promise<Configuration> {
	return {
		mode: webpackConfigModeMake(cfg),
		externals: [],
		plugins: await webpackConfigPluginsMake(cfg),
		profile: cfg.profiler
	};
}
