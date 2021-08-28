import {dest, src} from 'gulp';

import {Clean} from '../clean';
import {Create} from '../create';
import {LintOptions} from '../lint/options';
import {Run} from '../run';
import {TranspileOptions} from '../transpile/options';
import {makeString} from '@toreda/strong-types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const eslint = require('gulp-eslint');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nunjucksRender = require('gulp-nunjucks-render');

/**
 * Build steps that can be used directly in
 */
export class GulpSteps {
	public readonly run: Run;
	/** Create files and directories. */
	public readonly create: Create;
	/** Clean files & folders in preparation for build. */
	public readonly clean: Clean;

	/**
	 * Constructor
	 * @param build
	 * @param run
	 * @param create
	 * @param clean
	 */
	constructor(run: Run, create: Create, clean: Clean) {
		this.run = run;
		this.create = create;
		this.clean = clean;
	}

	/**
	 * Run preconfigured webpack build step.
	 * @returns
	 */
	public async webpack(): Promise<NodeJS.ReadWriteStream> {
		await this.run.webpack();

		return src('.', {allowEmpty: true});
	}

	/**
	 * Run lint
	 * @param options
	 * @returns
	 */
	public async lint(options: LintOptions): Promise<NodeJS.ReadWriteStream> {
		const lintPath = options.path ? options.path : 'src/**';
		this.eslint(lintPath);

		return src('.', {allowEmpty: true});
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

	public async createDir(
		targetPath: string | string[],
		overwrite?: boolean
	): Promise<NodeJS.ReadWriteStream> {
		const targetPaths: string[] = Array.isArray(targetPath) ? targetPath : [];

		if (typeof targetPath === 'string') {
			targetPaths.push(targetPath);
		}

		for (const target of targetPaths) {
			await this.create.dir(target, overwrite);
		}

		return src('.', {allowEmpty: true});
	}

	/**
	 * Recursively remove all files and folders from targetPath, and
	 * then removes the target folder.
	 * @param targetPath
	 * @returns
	 */
	public async cleanDir(targetPath: string | string[], force?: boolean): Promise<NodeJS.ReadWriteStream> {
		const targetPaths: string[] = Array.isArray(targetPath) ? targetPath : [];

		if (typeof targetPath === 'string') {
			targetPaths.push(targetPath);
		}

		for (const target of targetPaths) {
			await this.clean.dir(target, force);
		}

		return src('.', {allowEmpty: true});
	}

	public async transpile(options: TranspileOptions): Promise<NodeJS.ReadWriteStream> {
		const tsConfigDir = makeString('./dist', options.tsConfigDirPath);
		const tsConfigFilname = makeString('tsconfig.json', options.tsConfigFilePath);

		return await this.run.typescript(tsConfigDir(), tsConfigFilname());
	}

	/**
	 * Run eslint inside gulp.
	 * @param lintPaths			Target paths to lint.
	 * @returns
	 */
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
}
