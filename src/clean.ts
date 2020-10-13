import {BuildFileUtils} from './file-utils';
import {BuildGulp} from './gulp';
import {BuildState} from './state';
import {EventEmitter} from 'events';

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

	public dir(path: string, force?: boolean): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if (typeof path !== 'string') {
				return reject(new Error('cleanFolder failed - path argument is not a valid string.'));
			}

			const cleanPath = path.trim();
			if (cleanPath === '') {
				return reject(new Error('cleanDir failed - path argument cannot be an empty string.'));
			}

			if (!force) {
				if (cleanPath === '.' || cleanPath === '/' || cleanPath === './' || cleanPath === '../') {
					return reject(
						new Error(
							`cleanDir failed - '${cleanPath}' is a protected path. Set the 'force' argument true to override this safety.`
						)
					);
				}
			}

			try {
				await this.fileUtils.deleteDirRecursive(cleanPath);
			} catch (e) {
				return reject(e);
			}

			return resolve();
		});
	}

	public folder(path: string, force?: boolean): Promise<any> {
		return this.dir(path, force);
	}
}
