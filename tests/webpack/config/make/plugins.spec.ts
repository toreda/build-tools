import {WebpackPluginInstance} from 'webpack';
import {webpackConfigMakePlugins} from '../../../../src/webpack/config/make/plugins';

const EMPTY_ARRAY: WebpackPluginInstance[] = [];

describe('webpackConfigMakePlugins', () => {
	it(`should return an empty array when cfg arg is undefined`, () => {
		expect(webpackConfigMakePlugins(undefined as any)).toStrictEqual(EMPTY_ARRAY);
	});

	it(`should return an empty array when cfg arg is null`, () => {
		expect(webpackConfigMakePlugins(null as any)).toStrictEqual(EMPTY_ARRAY);
	});

	it(`should return an empty array when cfg arg is an empty object`, () => {
		expect(webpackConfigMakePlugins({} as any)).toStrictEqual(EMPTY_ARRAY);
	});
});
