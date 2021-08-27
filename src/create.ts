import {BuildGulp} from './build/gulp';
import {Config} from './config';
import {EventEmitter} from 'events';
import {FileHelpers} from './file/helpers';
import {Log} from '@toreda/log';

/**
 * Create files and folders during build.
 */
export class Create {
	public readonly events: EventEmitter;
	public readonly fileUtils: FileHelpers;
	public readonly cfg: Config;
	public readonly gulp: BuildGulp;
	public readonly log: Log;

	constructor(cfg: Config, events: EventEmitter, log: Log) {
		this.events = events;
		this.fileUtils = new FileHelpers(log);
		this.cfg = cfg;
		this.gulp = new BuildGulp(cfg, events);
	}

	/**
	 * Create dir at target path. Fails by default when a file or dir already exists.
	 * @param path					Creates dir at this path.
	 * @param overwriteExisting		Fails when
	 * @returns
	 */
	public dir(path: string, overwriteExisting?: boolean): Promise<boolean> {
		return this.fileUtils.createDir(path, overwriteExisting);
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
