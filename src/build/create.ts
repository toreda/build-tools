import {BuildGulp} from './gulp';
import {BuildState} from './state';
import {EventEmitter} from 'events';
import {FileHelpers} from '../file/helpers';

/**
 * Helpers to create files and folders during build process.
 */
export class BuildCreate {
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
	 * Create dir at target path. Fails by default when a file or dir already exists.
	 * @param path
	 * @param overwriteExisting
	 * @returns
	 */
	public dir(path: string, overwriteExisting?: boolean): Promise<boolean> {
		return this.fileUtils.createDir(path, overwriteExisting);
	}

	/**
	 * Alias for dir
	 * @param path				Path where dir will be created.
	 * @param overwriteExisting
	 * @returns
	 */
	public folder(path: string, overwriteExisting?: boolean): Promise<boolean> {
		return this.dir(path, overwriteExisting);
	}
}
