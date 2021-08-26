import {BuildCreate} from '../build/create';
import {BuildGulp} from '../build/gulp';
import {BuildRun} from '../build/run';
import {Cleaner} from '../cleaner';
import {LintOptions} from '../lint/options';
import {TranspileOptions} from '../transpile/options';
import {makeString} from '@toreda/strong-types';
import {src} from 'gulp';

export class GulpSteps {
	private readonly build: BuildGulp;
	public readonly buildRun: BuildRun;
	public readonly buildCreate: BuildCreate;
	public readonly cleaner: Cleaner;

	constructor(build: BuildGulp, run: BuildRun, create: BuildCreate, cleaner: Cleaner) {
		this.build = build;
		this.buildRun = run;
		this.buildCreate = create;
		this.cleaner = cleaner;
	}

	/**
	 * Run preconfigured webpack build step.
	 * @returns
	 */
	public async webpack(): Promise<NodeJS.ReadWriteStream> {
		await this.buildRun.webpack();

		return src('.', {allowEmpty: true});
	}

	public async lint(options: LintOptions): Promise<NodeJS.ReadWriteStream> {
		const lintPath = options.path ? options.path : 'src/**';
		this.build.eslint(lintPath);

		return src('.', {allowEmpty: true});
	}

	public async createDir(targetPath: string | string[]): Promise<NodeJS.ReadWriteStream> {
		const targetPaths: string[] = Array.isArray(targetPath) ? targetPath : [];

		if (typeof targetPath === 'string') {
			targetPaths.push(targetPath);
		}

		for (const target of targetPaths) {
			await this.buildCreate.dir(target);
		}

		return src('.', {allowEmpty: true});
	}

	/**
	 * Recursively remove all files and folders from targetPath, and
	 * then removes the target folder.
	 * @param targetPath
	 * @returns
	 */
	public async clean(targetPath: string | string[]): Promise<NodeJS.ReadWriteStream> {
		const targetPaths: string[] = Array.isArray(targetPath) ? targetPath : [];

		if (typeof targetPath === 'string') {
			targetPaths.push(targetPath);
		}

		for (const target of targetPaths) {
			await this.cleaner.dir(target);
		}

		return src('.', {allowEmpty: true});
	}

	public async transpile(options: TranspileOptions): Promise<NodeJS.ReadWriteStream> {
		const tsConfigDir = makeString('./dist', options.tsConfigDirPath);
		const tsConfigFilname = makeString('tsconfig.json', options.tsConfigFilePath);

		return await this.buildRun.typescript(tsConfigDir(), tsConfigFilname());
	}
}
