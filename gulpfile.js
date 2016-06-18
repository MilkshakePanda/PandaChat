var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var browserSync = require('browser-sync');
var sass = require('gulp-ruby-sass');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var gutil  = require("gulp-util");
var reload = browserSync.reload;


gulp.task('browser-sync', function(){

   var files = [

      'assets/js/*.js',
      'assets/sass/**/*.sass'

   ];

   browserSync(files, {

      proxy: '127.0.0.1:1337',
      notify: true

   });

});

// Sass + prefix

gulp.task('sass', function(){

   return sass('assets/sass/main.sass', {

      style: 'compressed',
      loadPath: 'sass'

   })
   .on('error', function (err) {
      console.log('Error !', err.message);
   })
   .pipe(prefix({
      browsers: ['last 2 versions', '> 5%']
   }))
   .pipe(gulp.dest('public/css'))
   .pipe(reload({stream: true}));

});


gulp.task('watchAll', function () {

   gulp.watch('assets/sass/**/*.sass', ['sass']); // watch the sass files

});


function compile(watch) {
  var bundler = watchify(browserify('assets/js/app.js', { debug: true }).transform(babel, {presets: ["es2015", "react"]}));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('public/js/'))
      .pipe(reload({stream: true}));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch', "sass", "browser-sync", "watchAll"]);
