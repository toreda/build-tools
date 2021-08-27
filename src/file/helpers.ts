import {existsSync, mkdirSync, readFile, remove} from 'fs-extra';

import {FileOptions} from './options';
import {Log} from '@toreda/log';

/**
 * @category Files
 */
export class FileHelpers {
	public readonly log: Log;

	constructor(log: Log) {
		this.log = log.makeLog('FileHelpers');
	}

	public deleteDirRecursive(path: string): Promise<boolean | Error> {
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

	/**
	 * Get contents of file at target filePath as a string.
	 * @param filePath
	 * @param options
	 * @returns
	 */
	public getContents(filePath: string, options?: FileOptions): Promise<string | null> {
		const fileEncoding =
			options && typeof options.fileEncoding === 'string' ? options.fileEncoding : 'utf8';

		return new Promise((resolve, reject) => {
			readFile(filePath, fileEncoding, (err, data: string) => {
				if (err) {
					return reject(
						new Error(`Build failed to get file contents from '${filePath}' - ${err.message}.`)
					);
				}

				if (typeof data !== 'string') {
					return resolve(null);
				}

				resolve(data);
			});
		});
	}

	public createDir(path: string, overwriteExisting?: boolean): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (typeof path !== 'string') {
				reject(
					new Error('Failed to createFolder during build - path argument was not a valid string.')
				);
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
}
