import * as fs from 'fs-extra';

import Path from 'path';

export class ArmorBuildFileUtils {
	public deleteDirRecursive(path: string): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				fs.remove(path, () => {
					return resolve();
				});
			} catch (e) {
				return reject(e);
			}
		});
	}

	public getContents(filePath: string, options: any): Promise<any> {
		const fileEncoding = options && typeof options.fileEncoding === 'string' ? options.fileEncoding : 'utf8';

		return new Promise((resolve, reject) => {
			fs.readFile(filePath, fileEncoding, (err, data) => {
				if (err) {
					return reject(new Error(`Build failed to get file contents from '${filePath}' - ${err.message}.`));
				}

				resolve(data);
			});
		});
	}

	public createDir(path: string, failIfExists: boolean): Promise<any> {
		return new Promise((resolve, reject) => {
			if (typeof path !== 'string') {
				reject(new Error('Failed to createFolder during build - path argument was not a valid string.'));
			}

			if (fs.existsSync(path)) {
				if (failIfExists) {
					return reject(
						new Error('createFolder failed during build - folder exists at path and failIfExists is true.')
					);
				} else {
					return resolve();
				}
			}

			fs.mkdirSync(path);

			return resolve();
		});
	}
}
