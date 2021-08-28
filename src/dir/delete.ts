import {FileOptions} from '../file/options';
import {filePath} from '../file/path';
import {remove} from 'fs-extra';

export async function dirDelete(input: string | FileOptions): Promise<boolean | Error> {
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
