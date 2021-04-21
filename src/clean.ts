import {BuildFileUtils} from './file-utils';
import {BuildGulp} from './gulp';
import {BuildState} from './state';
import {EventEmitter} from 'events';

/**
 * Helpers used to recursively clean files and
 * directories in build output folder and intermediate
 * build folders.
 */
export class BuildClean {
	public readonly events: EventEmitter;
	public readonly fileUtils: BuildFileUtils;
	public readonly state: BuildState;
	public readonly gulp: BuildGulp;

	constructor(events: EventEmitter, state: BuildState) {
		this.events = events;
		this.fileUtils = new BuildFileUtils();
		this.state = state;
		this.gulp = new BuildGulp(events, state);
	}

	/**
	 * Clean target directory, recursively removing all files
	 * and directories.
	 * @param path
	 * @param force
	 * @returns
	 */
	public dir(path: string, force?: boolean): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if (typeof path !== 'string') {
				return reject(new Error('cleanDir failure - path is not a valid string.'));
			}

			const cleanPath = path.trim();
			if (cleanPath === '') {
				return reject(new Error('cleanDir failure - path cannot be an empty string.'));
			}

			if (!force) {
				if (cleanPath === '.' || cleanPath === '/' || cleanPath === './' || cleanPath === '../') {
					return reject(
						new Error(
							`cleanDir - '${cleanPath}' is a protected path. Set the 'force' argument true to override this safety.`
						)
					);
				}
			}

			try {
				await this.fileUtils.deleteDirRecursive(cleanPath);
			} catch (e) {
				return reject(e);
			}

			resolve(true);
		});
	}

	/**
	 * Alias for clean dir.
	 * @param path
	 * @param force
	 * @returns
	 */
	public folder(path: string, force?: boolean): Promise<any> {
		return this.dir(path, force);
	}
}
