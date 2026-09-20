import {Levels, Log} from '@toreda/log';
//const eslint = require('gulp-eslint');
import gulp, {dest, series, src} from 'gulp';

import {Build} from './src/build';
import {ESLint} from 'eslint';
import {EventEmitter} from 'stream';
import del from 'del';

const log = new Log({
	globalLevel: Levels.ALL,
	consoleEnabled: true
});

const build = new Build({log: log, events: new EventEmitter()});

const srcPatterns = ['src/**.ts', 'src/**/*.ts'];

async function linter() {
	const eslint = new ESLint();

	const result = await eslint.lintFiles(srcPatterns);
	const formatter = await eslint.loadFormatter('stylish');

	const output = formatter.format(result);
	console.log(output);
}

function createDist() {
	// Hack to create folder structures without actually reading files.
	// Nested folders need to be created in their nested order.
	return gulp.src('*.*', {read: false}).pipe(gulp.dest('./dist'));
}

function cleanDist() {
	return del(`dist/**`, {force: true});
}

function buildSrc() {
	// Build typescript sources as both CommonJS ('./dist/cjs') and ES modules ('./dist/esm').
	return build.gulpSteps.transpileAll();
}

exports.default = series(createDist, cleanDist, linter, buildSrc);
