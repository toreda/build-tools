import {existsSync, mkdirSync} from 'fs-extra';

export async function dirCreate(path: string, overwriteExisting?: boolean): Promise<boolean> {
	return new Promise((resolve, reject) => {
		if (typeof path !== 'string') {
			reject(new Error('Failed to createFolder during build - path argument was not a valid string.'));
		}

		if (existsSync(path)) {
			if (overwriteExisting === true) {
				return reject(
					new Error(
						'createFolder failed during build - folder exists at path and failIfExists is true.'
					)
				);
			} else {
				return resolve(true);
			}
		}

		mkdirSync(path);

		return resolve(true);
	});
}
