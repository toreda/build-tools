import {BuildGulp} from './build/gulp';
import {BuildState} from './build/state';
import {EventEmitter} from 'events';
import {FileHelpers} from './file/helpers';

/**
 * Helpers used to recursively clean files and
 * directories in build output folder and intermediate
 * build folders.
 */
export class Cleaner {
	public readonly events: EventEmitter;
	public readonly fileUtils: FileHelpers;
	public readonly state: BuildState;
	public readonly gulp: BuildGulp;

	constructor(events: EventEmitter, state: BuildState) {
		this.events = events;
		this.fileUtils = new FileHelpers();
		this.state = state;
		this.gulp = new BuildGulp(state, events);
	}

	/**
	 * Clean target directory, recursively removing all files
	 * and directories.
	 * @param path
	 * @param force
	 * @returns
	 */
	public dir(path: string, force?: boolean): Promise<boolean> {
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

			return resolve(true);
		});
	}

	/**
	 * Alias for clean dir.
	 * @param path
	 * @param force
	 * @returns
	 */
	public folder(path: string, force?: boolean): Promise<boolean> {
		return this.dir(path, force);
	}
}
