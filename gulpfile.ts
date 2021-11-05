//const eslint = require('gulp-eslint');
import gulp, {dest, series, src} from 'gulp';

import {ESLint} from 'eslint';
import del from 'del';
import ts from 'gulp-typescript';

const tsc = ts.createProject('tsconfig.json');
const eslint = new ESLint({
	useEslintrc: true
});
const srcPatterns = ['src/**.ts', 'src/**/*.ts'];

async function linter() {
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
	// Build typescript sources and output them in './dist'.
	return src(srcPatterns).pipe(tsc()).pipe(dest('dist'));
}

exports.default = series(createDist, cleanDist, linter, buildSrc);
