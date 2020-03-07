import * as fs from 'fs';
import * as path from 'path';

import {dest, src} from 'gulp';

import {AJSBuildToolsConfig} from './config';
import {EventEmitter} from 'events';
import gulpTsLint from 'gulp-tslint';
import gulpTypescript from 'gulp-typescript';

export class AJSBuildToolsGulp {
	public readonly events: EventEmitter;

	constructor(events: EventEmitter, config: AJSBuildToolsConfig) {
		this.events = events;
	}

	public copyContents(sourceDirPath: string, destDirPath: string) {}

	public runTsLint(tsConfigPath?: string) {
		const configPath = typeof tsConfigPath === 'string' ? tsConfigPath : './tsconfig.json';
		const project = gulpTypescript.createProject(configPath, {
			declaration: true
		});

		return project
			.src()
			.pipe(
				gulpTsLint({
					formatter: 'verbose'
				})
			)
			.pipe(gulpTsLint.report());
	}

	public runESlint() {}
}
