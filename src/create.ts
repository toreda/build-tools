import {BuildFileUtils} from './file-utils';
import {BuildGulp} from './gulp';
import {BuildState} from './state';
import {EventEmitter} from 'events';

export class BuildCreate {
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

	public dir(path: string, failIfExists?: boolean): Promise<any> {
		const shouldFailIfExists = !!failIfExists;
		return this.fileUtils.createDir(path, shouldFailIfExists);
	}

	public folder(path: string, failIfExists?: boolean): Promise<any> {
		const shouldFailIfExists = !!failIfExists;
		return this.dir(path, shouldFailIfExists);
	}
}
