import {CliArgs} from '../../../../../src/cli/args';

export function cliArgsMakeMock(args?: Partial<CliArgs>): CliArgs {
	return {
		debugMode: args?.debugMode || false,
		env: args?.env || 'prod',
		mockAll: args?.mockAll || false,
		autoMockInJest: args?.autoMockInJest || true,
		mockFileReads: args?.mockFileReads || false,
		mockFileWrites: args?.mockFileWrites || false,
		profiler: args?.profiler || false
	};
}
