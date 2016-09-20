var gulp         = require('gulp');
var sass         = require('gulp-sass');
var pug          = require('gulp-pug');
var nodemon      = require('gulp-nodemon')
var browserSync  = require('browser-sync').create();
var reload       = browserSync.reload;
var htmlInjector = require('bs-html-injector');

var paths = {
  scripts: './app/scripts/**/*.js',
  pug: './app/views/**/*.pug',
  sass: './app/sass/**/*.scss',
  css: './dist/css',
  html: './dist/html'
};

// Compiles the pug to html
gulp.task('views', function () {
  return gulp.src(paths.pug)
    .pipe(pug())
    .pipe(gulp.dest(paths.html));
});

// Compiles the sass to css
gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.css))
    .pipe(reload({ stream: true }));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.pug, ['views']);
});

// Start the server
gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js'
    , ext: 'js'
    , env: { 'NODE_ENV': 'development' }
  });
});

// Start browsersync
gulp.task('start', ['nodemon'], function () {
  browserSync.use(htmlInjector, {
    files: paths.html
  });
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    port: '3001'
  });
});

// Default task
gulp.task('default', ['start', 'watch', 'views', 'sass'], function() {});
