/**
 * Command line arguments used by Build. All other CLI args &
 * flags are ignored.
 *
 * @category CLI
 */
export interface CliArgs {
	[k: string]: unknown;
	env: string;
	profiler: boolean;
	debugMode: boolean;
	autoMockInJest: boolean;
	mockAll: boolean;
	mockFileReads: boolean;
	mockFileWrites: boolean;
}
