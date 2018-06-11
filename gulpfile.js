var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    path = require('path'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    log = require('gulplog'),
    globby = require('globby'),
    buffer = require('vinyl-buffer');

var env,
    scriptSrc,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle;

env = 'development';

if (env==='development'){
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

scriptSrc   = ['components/resources/scripts/*.js'];
sassSources = ['components/sass/style.scss'];
htmlSources = ['components/resources/*.html'];

gulp.task('scripts', function(){

  globby(scriptSrc).then(function(entries){
    var b = browserify({
      entries: entries,
      debug: true
    });

    return b.bundle()
      .pipe(source('script.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(gulpif(env === 'production', uglify()))
      .on('error', log.error)
      .pipe(gulpif(env === 'development',sourcemaps.write('./')))
      .pipe(gulp.dest(outputDir + 'scripts'))
      .pipe(connect.reload())
  });
});

gulp.task('style', function(){
  gulp.src(sassSources)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: sassStyle,
      includePaths: ['node_modules/susy/sass','node_modules/breakpoint-sass/stylesheets']
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
    }))
    .pipe(gulpif(env === 'development',sourcemaps.write()))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('watch', function(){
  gulp.watch(scriptSrc, ['scripts']);
  gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['style']);
  gulp.watch(htmlSources, ['html']);
});

gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    livereload: true,
    host: '0.0.0.0'
  });
});

gulp.task('html', function(){
  gulp.src(htmlSources)
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulp.dest(outputDir))
    .pipe(connect.reload())
});

// Copy resources to the environment
gulp.task('move', function(){
  //images
  gulp.src('components/resources/images/**/*.*')
  .pipe(gulp.dest(outputDir + 'images'));
  //fonts
  gulp.src('components/resources/fonts/**/*.*')
  .pipe(gulp.dest(outputDir + 'fonts'));
  //reset css
  gulp.src('components/resources/css/reset.css')
  .pipe(gulp.dest(outputDir + 'css'));
});

gulp.task('default', ['watch', 'html', 'scripts', 'style', 'move','connect']);