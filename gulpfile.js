var gulp          = require('gulp');
var sass          = require('gulp-sass');
var cssnano       = require('gulp-cssnano');
var pug           = require('gulp-pug');
var nodemon       = require('gulp-nodemon')
var rename        = require('gulp-rename');
var browserSync   = require('browser-sync').create();
var reload        = browserSync.reload;
var htmlInjector  = require('bs-html-injector');
var browserify    = require('browserify');
var watchify      = require('watchify');
var source        = require('vinyl-source-stream');
var assign        = require('lodash.assign');
var gutil         = require('gulp-util');

// Files paths
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
  icons: {
    inputDir: './node_modules/material-design-icons/iconfont/*.+(eot|svg|ttf|woff|woff2)',
    outputDir: './dist/fonts/icons'
  },
  scripts: {
    inputDir: './app/scripts/app.js',
    outputDir: './dist/js',
    outputFile: 'main.js'
  }
};

// Browserify options
var customOpts = {
  entries: [config.scripts.inputDir],
  debug: true
};

var opts = assign({}, watchify.args, customOpts);
var browserifyWatch = watchify(browserify(opts));

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
    .pipe(cssnano())
    .pipe(rename(config.css.outputFile))
    .pipe(gulp.dest(config.css.outputDir))
    .pipe(reload({ stream: true }));
});

// Compiles the JS with browserify
gulp.task('browserify', bundle); // so you can run `gulp js` to build the file
browserifyWatch.on('update', bundle); // on any dep update, runs the bundler
browserifyWatch.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return browserifyWatch.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(config.scripts.outputFile))
    .pipe(gulp.dest(config.scripts.outputDir))
    .pipe(browserSync.reload({ stream: true }));
}

gulp.task('icons', function () {
  return gulp.src(config.icons.inputDir)
    .pipe(gulp.dest(config.icons.outputDir));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(config.css.inputDir, ['sass']);
  gulp.watch(config.html.inputDir, ['views']);
  // gulp.watch(config.scripts.inputDir, ['js']);
});

// Start the server
gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    },
    watch: ['app.js', 'gulpfile.js', 'app/routes/index.js']
  })
  .on('restart', function () {
    // Set slight delay when reloading the page
    setTimeout(function () {
      reload({
        stream: false
      });
    }, 500);
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
gulp.task('default', ['start', 'watch', 'views', 'sass', 'icons', 'browserify'], function() {});
