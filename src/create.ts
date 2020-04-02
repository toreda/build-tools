import {ArmorBuildConfig} from './config';
import {ArmorBuildFileUtils} from './file-utils';
import {ArmorBuildGulp} from './gulp';
import {EventEmitter} from 'events';

export class ArmorBuildCreate {
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

	public dir(path: string, failIfExists?: boolean): Promise<any> {
		const shouldFailIfExists = !!failIfExists;
		return this.fileUtils.createDir(path, shouldFailIfExists);
	}

	public folder(path: string, failIfExists?: boolean): Promise<any> {
		const shouldFailIfExists = !!failIfExists;
		return this.dir(path, shouldFailIfExists);
	}
}
