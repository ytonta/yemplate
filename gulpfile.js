var gulp          = require('gulp');
var sass          = require('gulp-sass');
var pug           = require('gulp-pug');
var nodemon       = require('gulp-nodemon')
var rename        = require('gulp-rename');
var browserSync   = require('browser-sync').create();
var reload        = browserSync.reload;
var htmlInjector  = require('bs-html-injector');
var webpack       = require('webpack-stream');
var webpack2      = require('webpack');
var webpackConfig = require('./webpack.config.js');
var WebpackDevServer = require('webpack-dev-server');

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
    inputDir: './app/scripts/app.js',
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
    .pipe(webpack( webpackConfig ))
    .pipe(gulp.dest(config.scripts.outputDir));
    // .pipe(reload({ stream: true }));
});

gulp.task('webpack', function() {
  var myConfig = Object.create(webpackConfig);

  new WebpackDevServer(webpack2(myConfig), {
    publicPath: config.html.outputDir,
    stats: {
      colors: true
    }
  }).listen(8080, 'localhost');
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(config.css.inputDir, ['sass']);
  gulp.watch(config.html.inputDir, ['views']);
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
gulp.task('default', ['webpack', 'watch', 'views', 'sass', 'js'], function() {});
