import {BuildGulp} from './build/gulp';
import {Config} from './config';
import {EventEmitter} from 'events';
import {Log} from '@toreda/log';
import {dirCreate} from './dir/create';

/**
 * Create files and folders during build.
 */
export class Create {
	public readonly events: EventEmitter;
	public readonly cfg: Config;
	public readonly gulp: BuildGulp;
	public readonly log: Log;

	constructor(cfg: Config, events: EventEmitter, log: Log) {
		this.events = events;
		this.cfg = cfg;
		this.gulp = new BuildGulp(cfg, events);
		this.log = log.makeLog('Create');
	}

	/**
	 * Create dir at target path. Fails by default when a file or dir already exists.
	 * @param path					Creates dir at this path.
	 * @param overwriteExisting		Fails when
	 * @returns
	 */
	public dir(path: string, overwrite?: boolean): Promise<boolean> {
		return dirCreate(path, {
			overwrite: overwrite === true ? true : false
		});
	}

	/**
	 * Alias for dir
	 * @param path					Creates dir at this path.
	 * @param overwriteExisting
	 * @returns
	 */
	public folder(path: string, overwriteExisting?: boolean): Promise<boolean> {
		return this.dir(path, overwriteExisting);
	}
}
