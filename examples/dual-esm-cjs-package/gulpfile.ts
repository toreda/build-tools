import {Levels, Log} from '@toreda/log';

import {Build} from '@toreda/build-tools';
import {EventEmitter} from 'events';
import {series} from 'gulp';

const log = new Log({
	consoleEnabled: true,
	globalLevel: Levels.ALL
});

const build: Build = new Build({
	log: log,
	events: new EventEmitter(),
	linter: {
		globInputPaths: true
	}
});

async function runLint(): Promise<NodeJS.ReadWriteStream> {
	return build.gulpSteps.lint({
		formatterId: 'stylish',
		srcPatterns: ['./src/**.ts', './src/**/**.ts']
	});
}

function createDist(): Promise<NodeJS.ReadWriteStream> {
	return build.gulpSteps.createDir('./dist', true);
}

function cleanDist(): Promise<NodeJS.ReadWriteStream> {
	return build.gulpSteps.cleanDir('./dist', true);
}

/**
 * Build CommonJS output in './dist/cjs' and ES module output in './dist/esm' from
 * './tsconfig.json'. Pass `esmTsConfigPath` to use a separate tsconfig for ESM output.
 */
function buildSrc(): Promise<NodeJS.ReadWriteStream> {
	return build.gulpSteps.transpileAll();
}

exports.default = series(createDist, cleanDist, runLint, buildSrc);
