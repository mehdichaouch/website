'use strict';

let browserSync = require('browser-sync');
let gulp = require('gulp');
let concat = require('gulp-concat');
let csso = require('gulp-csso');
let sass = require('gulp-dart-sass');
let imagemin = require('gulp-imagemin');
let plumber = require('gulp-plumber');
let uglify = require('gulp-uglify');

let cp = require('child_process');

let jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task('jekyll-build', function(done) {
    return cp.spawn(jekyllCommand, ['build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

/*
 * Rebuild Jekyll & reload browserSync
 */
gulp.task('jekyll-rebuild', gulp.series(['jekyll-build'], function(done) {
    browserSync.reload();
    done();
}));

/*
 * Build the jekyll site and launch browser-sync
 */
gulp.task('browser-sync', gulp.series(['jekyll-build'], function(done) {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
    done()
}));

/*
 * Compile and minify sass
 */
gulp.task('sass', function() {
    return gulp.src('src/styles/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(csso())
        .pipe(gulp.dest('assets/css/'))
});

/*
 * Compile fonts
 */
gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*.{ttf,woff,woff2}')
        .pipe(plumber())
        .pipe(gulp.dest('assets/fonts/'))
});

/*
 * Minify images
 */
gulp.task('imagemin', function() {
    return gulp.src('src/img/**/*.{jpg,png,gif}')
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('assets/img/'))
});

/**
 * Compile and minify js
 */
gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/'))
});

/**
 * Copy particlejs conf
 */
gulp.task('particlejs', function() {
    return gulp.src('src/js/particlesjs-config.json')
        .pipe(plumber())
        .pipe(gulp.dest('assets/js/'))
});

/**
 * Copy favicon
 */
gulp.task('favicon', function() {
    return gulp.src('src/favicon/**/*.{ico,png,svg}')
        .pipe(plumber())
        .pipe(gulp.dest('assets/favicon/'))
});

gulp.task('watch', function() {
    gulp.watch('src/styles/**/*.scss', gulp.series(['sass', 'jekyll-rebuild']));
    gulp.watch('src/js/**/*.js', gulp.series(['js', 'jekyll-rebuild']));
    gulp.watch('src/js/particlesjs-config.json', gulp.series(['particlejs', 'jekyll-rebuild']));
    gulp.watch('src/fonts/**/*.{tff,woff,woff2}', gulp.series(['fonts']));
    gulp.watch('src/img/**/*.{jpg,png,gif}', gulp.series(['imagemin']));
    gulp.watch(['*html', '_includes/*html', '_layouts/*.html'], gulp.series(['jekyll-rebuild']));
});

gulp.task('default', gulp.series(['js', 'particlejs', 'sass', 'fonts', 'favicon', 'browser-sync', 'watch']));
