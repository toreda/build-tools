export function jestEnv(): boolean {
	return process?.env?.JEST_WORKER_ID !== undefined;
}
