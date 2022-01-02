import {Levels, Log} from '@toreda/log';
import {series, src} from 'gulp';

import {Build} from '@toreda/build-tools';
import {EventEmitter} from 'events';

const events = new EventEmitter();
const build = new Build({
	events: events,
	log: new Log({
		globalLevel: Levels.ALL,
		consoleEnabled: true
	})
});

async function runLint(): Promise<NodeJS.ReadWriteStream> {
	await build.linter.execute({
		formatterId: 'stylish',
		srcPatterns: ['./src/**.ts', './src/**/**.ts']
	});

	return src(['*'], {
		read: false
	});
}

function createDist(): Promise<NodeJS.ReadWriteStream> {
	return build.gulpSteps.createDir('./dist', true);
}

function cleanDist(): Promise<NodeJS.ReadWriteStream> {
	return build.gulpSteps.cleanDir('./dist', true);
}

function buildSrc(): Promise<NodeJS.ReadWriteStream> {
	return build.run.typescript('./dist', 'tsconfig.json');
}

exports.default = series(createDist, cleanDist, runLint, buildSrc);
