import * as fs from 'fs';
import * as path from 'path';

import {dest, src} from 'gulp';

import {ArmorBTConfig} from './config';
import {EventEmitter} from 'events';
import gulpTsLint from 'gulp-tslint';
import gulpTypescript from 'gulp-typescript';

// tslint:disable-next-line
const nunjucksRender = require('gulp-nunjucks-render');


export class ArmorBTGulp {
	public readonly events: EventEmitter;
	public readonly config: ArmorBTConfig;

	constructor(events: EventEmitter, config: ArmorBTConfig) {
		if (!events) {
			throw new Error('Armor Build Tools (Gulp) init failed - events constructor argument missing.');
		}

		if (!config) {
			throw new Error('Armor Build Tools (Gulp) init failed - config constructor argument missing.');
		}

		this.events = events;
		this.config = config;
	}

	public renderNunjucksHtml(templatePath: string, srcPattern: string, destPath: string) {
		return src(srcPattern)
			.pipe(
				nunjucksRender({
					path: templatePath
				})
			)
			.pipe(dest(destPath));
	}

	public copyContents(srcPattern: string, destPath: string) {
		return src(srcPattern).pipe(dest(destPath));
	}

	public tslint(tsConfigPath?: string) {
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

	public eslint() {}
}
