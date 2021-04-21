import {dest, src} from 'gulp';

import {BuildClean} from './clean';
import {BuildCreate} from './create';
import {BuildGulp} from './gulp';
import {BuildRun} from './run';
import {CleanOptions} from './clean-options';
import {LintOptions} from './lint-options';
import {TranspileOptions} from './transpile-options';
import {makeString} from '@toreda/strong-types';

export class BuildSteps {
	private readonly build: BuildGulp;
	public readonly buildRun: BuildRun;
	public readonly buildCreate: BuildCreate;
	public readonly buildClean: BuildClean;

	constructor(build: BuildGulp, run: BuildRun, create: BuildCreate, clean: BuildClean) {
		this.build = build;
		this.buildRun = run;
		this.buildCreate = create;
		this.buildClean = clean;
	}

	public async webpack(): Promise<NodeJS.ReadWriteStream> {
		await this.buildRun.webpack();
		return src('.', {allowEmpty: true});
	}

	public async lint(options: LintOptions): Promise<NodeJS.ReadWriteStream> {
		const lintPath = options.path ? options.path : 'src/**';
		this.build.eslint(lintPath);

		return src('.', {allowEmpty: true});
	}

	public async clean(options: CleanOptions): Promise<NodeJS.ReadWriteStream> {
		if (!Array.isArray(options.paths)) {
			throw new Error('BuildSteps.clean failed - options.paths must be an array.');
		}

		for (const path of options.paths) {
			await this.buildClean.dir(path);
		}

		return src('.', {allowEmpty: true});
	}

	public async transpile(options: TranspileOptions): Promise<NodeJS.ReadWriteStream> {
		const tsConfigDir = makeString(options.configDir, './dist');
		const tsConfigFilname = makeString(options.configFilename, 'tsconfig.json');
		return await this.buildRun.typescript(tsConfigDir(), tsConfigFilname());
	}
}
