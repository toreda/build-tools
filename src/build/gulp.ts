import {dest, src} from 'gulp';

import {BuildState} from './state';
import {EventEmitter} from 'events';

const eslint = require('gulp-eslint');
const nunjucksRender = require('gulp-nunjucks-render');

export class BuildGulp {
	public readonly events: EventEmitter;
	public readonly state: BuildState;

	constructor(state: BuildState, events: EventEmitter) {
		if (!state) {
			throw new Error('BuildGulp init - state constructor argument missing.');
		}

		if (!events) {
			throw new Error('BuildGulp init - events constructor argument missing.');
		}

		this.events = events;
		this.state = state;
	}

	public renderNunjucksHtml(
		templatePath: string,
		srcPattern: string,
		destPath: string
	): NodeJS.ReadWriteStream {
		return src(srcPattern)
			.pipe(
				nunjucksRender({
					path: templatePath
				})
			)
			.pipe(dest(destPath));
	}

	/**
	 * Recursively copy src dir contents matching regex pattern to target dest dir.
	 * @param srcPattern		Regex pattern matching designed src files.
	 * @param destPath			Target dir where contents are copied to.
	 * @returns
	 */
	public copyContents(srcPattern: string, destPath: string): NodeJS.ReadWriteStream {
		return src(srcPattern).pipe(dest(destPath));
	}

	public eslint(lintPaths?: string | string[]): NodeJS.ReadWriteStream {
		const defaultPath = 'src/**';
		let paths: string[] = [];

		if (Array.isArray(lintPaths)) {
			paths = lintPaths;
		} else if (typeof lintPaths === 'string') {
			paths.push(lintPaths);
		} else {
			paths.push(defaultPath);
		}

		return (
			src(paths)
				// eslint() attaches the lint output to the "eslint" property
				// of the file object so it can be used by other modules.
				.pipe(eslint())
				// eslint.format() outputs the lint results to the console.
				// Alternatively use eslint.formatEach() (see Docs).
				.pipe(eslint.format())
				// To have the process exit with an error code (1) on
				// lint error, return the stream and pipe to failAfterError last.
				.pipe(eslint.failAfterError())
		);
	}
}
