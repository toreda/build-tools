import {FileOptions} from './options';
import {readFile} from 'fs-extra';

/**
 * Get file contents as a string for target file found at `filePath`.
 * @param filePath
 * @param options
 * @returns			File contents as string when file is found at filePath, or null file is not found,
 *					or the file could not be read due to permissions, or other errors.
 *
 * @category Files
 */
export async function fileContents(filePath: string, options?: FileOptions): Promise<string | null> {
	const encoding = options && typeof options.encoding === 'string' ? options.encoding : 'utf8';

	return new Promise((resolve, reject) => {
		readFile(filePath, encoding, (err, data: string) => {
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
