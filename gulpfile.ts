import {Levels, Log} from '@toreda/log';
//const eslint = require('gulp-eslint');
import gulp, {dest, series, src} from 'gulp';

import {Config} from './src/config';
import {ESLint} from 'eslint';
import {EventEmitter} from 'stream';
import {Run} from './src/run';
import del from 'del';

const log = new Log({
	globalLevel: Levels.ALL,
	consoleEnabled: true
});

const cfg = new Config({}, {}, log);
const events = new EventEmitter();

const srcPatterns = ['src/**.ts', 'src/**/*.ts'];

async function linter() {
	const eslint = new ESLint({
		useEslintrc: true
	});

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

async function buildSrc() {
	// Build typescript sources and output them in './dist'.
	//return src(srcPatterns).pipe(tsc()).pipe(dest('dist'));
	const run = new Run(cfg, events, log);
	await run.typescript('./dist', './tsconfig.json');
}

exports.default = series(createDist, cleanDist, linter, buildSrc);
