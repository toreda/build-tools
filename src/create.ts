import {Config} from './config';
import {Configuration} from 'webpack';
import {EventEmitter} from 'events';
import {Log} from '@toreda/log';
import {dirCreate} from './dir/create';

/**
 * Create files and folders during build.
 */
export class Create {
	/** Global EventEmitter instance. */
	public readonly events: EventEmitter;
	/** Global config instance. */
	public readonly cfg: Config;
	/** Global log instance. */
	public readonly log: Log;

	constructor(cfg: Config, events: EventEmitter, log: Log) {
		this.events = events;
		this.cfg = cfg;
		this.log = log.makeLog('create');
	}

	public webpackCfg(cfg: Config): Configuration {
		return {};
	}
	/**
	 * Create dir at target path. Fails by default when a file or dir already exists.
	 * @param path					Creates dir at this path.
	 * @param overwriteExisting		Fails when
	 * @returns
	 */
	public async dir(path: string, overwrite?: boolean): Promise<boolean> {
		if (this.cfg.mockOperations === true) {
			return true;
		}

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
