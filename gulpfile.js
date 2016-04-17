/**
 * Created by jack on 16-4-17.
 */

const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');

const BACKENDSOURCE = path.join(__dirname, 'server');
const DISTPATH = path.join(__dirname, 'dist');

gulp.task('build-backend', ['clean'], () => {
	return gulp.src(BACKENDSOURCE + '/**/*.js')
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['transform-runtime', 'transform-async-to-generator']
		}))
		.pipe(gulp.dest(DISTPATH + '/server'));
});

gulp.task('clean', () => {
	return gulp.src(DISTPATH + '/server', {read: false})
		.pipe(clean());
});

gulp.task('watch-backend', () => {
	gulp.watch(BACKENDSOURCE + '/**/*.js', ['build-backend']);
});

gulp.task('default', ['build-backend', 'watch-backend']);
