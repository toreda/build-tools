import {ArmorBuildConfig} from './config';
import {ArmorBuildFileUtils} from './file-utils';
import {ArmorBuildGulp} from './gulp';
import {EventEmitter} from 'events';

export class ArmorBuildClean {
	public readonly events: EventEmitter;
	public readonly fileUtils: ArmorBuildFileUtils;
	public readonly config: ArmorBuildConfig;
	public readonly gulp: ArmorBuildGulp;

	constructor(events: EventEmitter, config: ArmorBuildConfig) {
		this.events = events;
		this.fileUtils = new ArmorBuildFileUtils();
		this.config = config;
		this.gulp = new ArmorBuildGulp(events, config);
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
