import {BuildGulp} from '../build/gulp';
import {Cleaner} from '../cleaner';
import {Create} from '../create';
import {LintOptions} from '../lint/options';
import {Run} from '../run';
import {TranspileOptions} from '../transpile/options';
import {makeString} from '@toreda/strong-types';
import {src} from 'gulp';

export class GulpSteps {
	private readonly build: BuildGulp;
	public readonly run: Run;
	public readonly create: Create;
	public readonly cleaner: Cleaner;

	constructor(build: BuildGulp, run: Run, create: Create, cleaner: Cleaner) {
		this.build = build;
		this.run = run;
		this.create = create;
		this.cleaner = cleaner;
	}

	/**
	 * Run preconfigured webpack build step.
	 * @returns
	 */
	public async webpack(): Promise<NodeJS.ReadWriteStream> {
		await this.run.webpack();

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
			await this.create.dir(target);
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

		return await this.run.typescript(tsConfigDir(), tsConfigFilname());
	}
}
