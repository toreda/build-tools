import * as fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';

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
		this.events = events;
		this.config = config;
	}

	public buildAndCopyNunjucksHtml(templatePath: string, srcPattern: string, destPath: string) {
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

	public tsLint(tsConfigPath?: string) {
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

	public webpack(configPath?: string): Promise<any> {
		if (!configPath) {
			configPath = this.config.env === 'dev' ? 'webpack.dev.js' : 'webpack.prod.js';
		}

		return new Promise((resolve, reject) => {
			webpack(configPath, (err, stats) => {
				if (err) {
					console.error(`webpack build failed: ${err.message}.`);
					return reject(err);
				}

				if (stats.hasErrors()) {
					console.error('webpack build error: ');
					stats.compilation.errors.forEach((error) => {
						console.error(error);
					});
					return reject(stats.compilation.errors.join('\n'));
				}

				resolve();
			});
		});
	}
}
