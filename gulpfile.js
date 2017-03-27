var gulp          = require('gulp');
var sass          = require('gulp-sass');
var cssnano       = require('gulp-cssnano');
var pug           = require('gulp-pug');
var nodemon       = require('gulp-nodemon')
var rename        = require('gulp-rename');
var browserSync   = require('browser-sync').create();
var reload        = browserSync.reload;
var htmlInjector  = require('bs-html-injector');

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
    .pipe(cssnano())
    .pipe(rename('main.css'))
    .pipe(gulp.dest(config.css.outputDir))
    .pipe(reload({ stream: true }));
});

// Copy font from node modules to font folder
gulp.task('fonts', function() {
  return gulp.src(config.fonts.inputDir)
    .pipe(gulp.dest(config.fonts.outputDir));
})

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
gulp.task('default', ['start', 'watch', 'views', 'sass', 'fonts', 'icons'], function() {});
