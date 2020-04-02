import {ArmorBTConfig} from './config';
import {ArmorBTFileUtils} from './file-utils';
import {ArmorBTGulp} from './gulp';
import {EventEmitter} from 'events';

export class ArmorBTClean {
	public readonly events: EventEmitter;
	public readonly fileUtils: ArmorBTFileUtils;
	public readonly config: ArmorBTConfig;
	public readonly gulp: ArmorBTGulp;

	constructor(events: EventEmitter, config: ArmorBTConfig) {
		this.events = events;
		this.fileUtils = new ArmorBTFileUtils();
		this.config = config;
		this.gulp = new ArmorBTGulp(events, config);
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
