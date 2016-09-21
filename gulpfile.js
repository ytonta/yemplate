var gulp          = require('gulp');
var sass          = require('gulp-sass');
var pug           = require('gulp-pug');
var nodemon       = require('gulp-nodemon')
var rename        = require('gulp-rename');
var browserSync   = require('browser-sync').create();
var reload        = browserSync.reload;
var htmlInjector  = require('bs-html-injector');
var webpack       = require('webpack-stream');

var config = {
  html: {
    inputDir: './app/views/**/*.pug',
    outputDir: './dist/html'
  },
  css: {
    inputDir: './app/sass/**/*.scss',
    outputDir: './dist/css',
    outputFile: 'main.css'
  },
  scripts: {
    inputDir: './app/scripts/**/*.js',
    outputDir: './dist/js',
    outputFile: 'main.js'
  }
};

// Compiles the pug to html
gulp.task('views', function () {
  return gulp.src(config.html.inputDir)
    .pipe(pug())
    .pipe(gulp.dest(config.html.outputDir));
});

// Compiles the sass to css
gulp.task('sass', function () {
  return gulp.src(config.css.inputDir)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('main.css'))
    .pipe(gulp.dest(config.css.outputDir))
    .pipe(reload({ stream: true }));
});

// Webpack function, bundles the js
gulp.task('js', function() {
  return gulp.src(config.scripts.inputDir)
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(rename('main.js'))
    .pipe(gulp.dest(config.scripts.outputDir));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(config.css.inputDir, ['sass']);
  gulp.watch(config.html.inputDir, ['views']);
});

// Start the server
gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js'
    , env: { 'NODE_ENV': 'development' }
  });
});

// Start browsersync
gulp.task('start', ['nodemon'], function () {
  browserSync.use(htmlInjector, {
    files: config.html.outputDir
  });
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    port: '3001'
  });
});

// Default task
gulp.task('default', ['start', 'watch', 'views', 'sass', 'js'], function() {});
