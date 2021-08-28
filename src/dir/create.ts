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
export async function dirCreate(path: string, options?: FileOptions): Promise<boolean> {
	const overwrite = options && typeof options.overwrite === 'boolean' ? options.overwrite : false;

	return new Promise((resolve, reject) => {
		if (typeof path !== 'string') {
			reject(new Error('Failed to createFolder during build - path argument was not a valid string.'));
		}

		try {
			if (existsSync(path)) {
				if (overwrite !== true) {
					return reject(new Error('createFolder failed during build - folder exists at path.'));
				} else {
					return resolve(true);
				}
			}

			mkdirSync(path);
		} catch (e) {
			return reject(`dirCreate failed: ${e.message}.`);
		}

		return resolve(true);
	});
}
