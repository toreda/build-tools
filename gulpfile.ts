//const eslint = require('gulp-eslint');
import gulp, {dest, series, src} from 'gulp';

import del from 'del';
import ts from 'gulp-typescript';

const tsc = ts.createProject('tsconfig.json');

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
	return src(['src/**.ts', 'src/**/*.ts']).pipe(tsc()).pipe(dest('dist'));
}

exports.default = series(createDist, cleanDist, buildSrc);
