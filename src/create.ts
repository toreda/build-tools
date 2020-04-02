import {ArmorBTConfig} from './config';
import {ArmorBTFileUtils} from './file-utils';
import {ArmorBTGulp} from './gulp';
import {EventEmitter} from 'events';

export class ArmorBTCreate {
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

	public dir(path: string, failIfExists?: boolean): Promise<any> {
		const shouldFailIfExists = !!failIfExists;
		return this.fileUtils.createDir(path, shouldFailIfExists);
	}

	public folder(path: string, failIfExists?: boolean): Promise<any> {
		const shouldFailIfExists = !!failIfExists;
		return this.dir(path, shouldFailIfExists);
	}
}
