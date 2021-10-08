import {Config, jestEnv} from '..';
import {existsSync, mkdirSync} from 'fs-extra';

import {FileOptions} from '../file/options';

/**
 * Create directory at target path. Fails when
 * @param path
 * @param options
 * @returns
 *
 * @category Files
 */
export async function dirCreate(cfg: Config, path: string, options?: FileOptions): Promise<boolean> {
	const overwrite = typeof options?.overwrite === 'boolean' ? options?.overwrite : false;

	if (!cfg) {
		return false;
	}

	const autoMock = cfg.autoMockInJest && jestEnv();
	const mockReads = autoMock || cfg.mocks.all || cfg.mocks.fileReads;
	const mockWrites = autoMock || cfg.mocks.all || cfg.mocks.fileWrites;

	return new Promise((resolve, reject) => {
		if (typeof path !== 'string') {
			reject(new Error('Failed to createFolder during build - path argument was not a valid string.'));
		}

		// Assume success & return before the existSync read when read ops are mocked.
		if (mockReads) {
			return resolve(true);
		}

		if (existsSync(path)) {
			if (overwrite !== true) {
				return reject(new Error('createFolder failed during build - folder exists at path.'));
			} else {
				return resolve(true);
			}
		}

		// Assume success & return when write ops are mocked.
		if (mockWrites) {
			return resolve(true);
		}

		mkdirSync(path);

		return resolve(true);
	});
}
