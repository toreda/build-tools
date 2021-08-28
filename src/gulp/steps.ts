import {BuildGulp} from '../build/gulp';
import {Clean} from '../clean';
import {Create} from '../create';
import {LintOptions} from '../lint/options';
import {Run} from '../run';
import {TranspileOptions} from '../transpile/options';
import {makeString} from '@toreda/strong-types';
import {src} from 'gulp';

/**
 * Build steps that can be used directly in
 */
export class GulpSteps {
	private readonly build: BuildGulp;
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
	constructor(build: BuildGulp, run: Run, create: Create, clean: Clean) {
		this.build = build;
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
		this.build.eslint(lintPath);

		return src('.', {allowEmpty: true});
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
}
