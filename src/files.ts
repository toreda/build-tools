import { AJSBuildToolsFileUtils } from './file-utils';
import { AJSBuildToolsFilesGetContentsOptions } from './get-contents-options';
import {EventEmitter} from 'events';

export class AJSBuildToolsFiles {
	public readonly events: EventEmitter;
	public readonly utils: AJSBuildToolsFileUtils;

	constructor(events: EventEmitter) {
		this.events = events;
		this.utils = new AJSBuildToolsFileUtils();
	}

	public getContents(path: string, options?: AJSBuildToolsFilesGetContentsOptions): Promise<string|Error> {
		return this.utils.getContents(path, options);
	}

	public createDir(path: string, failIfExists?: boolean): Promise<any> {
		const shouldFailIfExists = !!failIfExists;
		return this.utils.createDir(path, shouldFailIfExists);
	}

	public createFolder(path: string, failIfExists?: boolean): Promise<any> {
		const shouldFailIfExists = !!failIfExists;
		return this.createDir(path, shouldFailIfExists);
	}

	public cleanFolder(path: string, force?: boolean): Promise<any> {
		return this.cleanDir(path, force);
	}

	public cleanDir(path: string, force?: boolean): Promise<any> {
		return new Promise(async(resolve, reject) => {
			if (typeof path !== 'string') {
				return reject(new Error('cleanFolder failed - path argument is not a valid string.'))
			}

			const cleanPath = path.trim();
			if (cleanPath === '') {
				return reject(new Error('cleanDir failed - path argument cannot be an empty string.'));
			}

			if (!force) {
				if (cleanPath === '.' || cleanPath === '/' || cleanPath === './' || cleanPath === '../') {
					return reject(new Error(`cleanDir failed - '${cleanPath}' is a protected path. Set the 'force' argument true to override this safety.`))
				}
			}

			try {
				await this.utils.deleteDirRecursive(cleanPath);
			} catch (e) {
				return reject(e);
			}

			return resolve();
		});
	}
}
