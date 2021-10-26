import {dest, src} from 'gulp';

import {Clean} from '../clean';
import {Create} from '../create';
import {Linter} from '../linter';
import {LinterTarget} from '../linter/target';
import {Run} from '../run';
import {TranspileOptions} from '../transpile/options';

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
	public readonly linter: Linter;
	/**
	 * Constructor
	 * @param build
	 * @param run
	 * @param create
	 * @param clean
	 */
	constructor(run: Run, create: Create, linter: Linter, clean: Clean) {
		this.run = run;
		this.create = create;
		this.clean = clean;
		this.linter = linter;
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
		const tsConfigDir = typeof options.tsConfigDirPath === 'string' ? options.tsConfigDirPath : './dist';
		const tsConfigFilname =
			typeof options.tsConfigFilePath === 'string' ? options.tsConfigDirPath : 'tsconfig.json';

		return await this.run.typescript(tsConfigDir, tsConfigFilname);
	}

	public async lint(tgt: LinterTarget): Promise<NodeJS.ReadWriteStream> {
		const result = await this.linter.execute(tgt);



		return src([], {
			read: false
		});
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
