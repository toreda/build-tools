import {filePath} from '../file/path';
import {remove} from 'fs-extra';

/**
 * Delete target directory
 * @param input			File path of directory to delete.
 * @returns
 *
 * @category Files
 */
export async function dirDelete(input: string): Promise<boolean | Error> {
	const path = filePath(input);

	if (path === null) {
		throw new Error('Bad path format or missing path in dir delete');
	}

	return new Promise((resolve, reject) => {
		try {
			remove(path, () => {
				return resolve(true);
			});
		} catch (e) {
			return reject(e);
		}
	});
}
