import {Config} from './config';
import {EventEmitter} from 'events';
import {Log} from '@toreda/log';
import {dirDelete} from './dir/delete';

/**
 * Helpers used to recursively clean files and
 * directories in build output folder and intermediate
 * build folders.
 *
 * @category Clean
 */
export class Clean {
	public readonly events: EventEmitter;
	public readonly cfg: Config;
	public readonly log: Log;

	constructor(cfg: Config, events: EventEmitter, log: Log) {
		this.events = events;
		this.cfg = cfg;
		this.log = log.makeLog('Clean');
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
				await dirDelete(this.cfg, cleanPath);
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
