import {Config} from '../config';
import {filePath} from '../file/path';
import {jestEnv} from '../jest/env';
import {remove} from 'fs-extra';

/**
 * Delete target directory
 * @param input			File path of directory to delete.
 * @returns
 *
 * @category Files
 */
export async function dirDelete(cfg: Config, input: string): Promise<boolean | Error> {
	if (!cfg) {
		return false;
	}

	const path = filePath(input);

	const autoMock = cfg.autoMockInJest && jestEnv();
	const mockWrites = autoMock || cfg.mocks.all || cfg.mocks.fileWrites;

	if (path === null) {
		throw new Error('Bad path format or missing path in dir delete');
	}

	return new Promise((resolve, reject) => {
		if (mockWrites) {
			return resolve(true);
		}

		try {
			remove(path, () => {
				return resolve(true);
			});
		} catch (e) {
			return reject(e);
		}
	});
}
