'use strict';
var gulp = require('gulp')
var runSequence = require('run-sequence')
var gulpLoadPlugins = require('gulp-load-plugins')
var sass = require('gulp-sass')
var livereload = require('gulp-livereload')
var replace = require('gulp-replace')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var gutil = require('gulp-util')
var appRoot = require('app-root-path')
var Buffer = require('buffer').Buffer
var PluginError = gutil.PluginError
var map = require('event-stream').map
var versionNumberCached = ''
var defaults = {
  versionRegex: function (extensions) {
    var exts = extensions.join('|'),
      regexString = "(\\.(?:" + exts + ")\\?v=)(\\@versionefactory\\@)";
    return new RegExp(regexString, 'ig');
  }
}
var ShortId = function () {
  var lastTime,
    _self = this;
  /**
   * Get new pseudo-unique id
   * @alias next
   * @returns {string} Unique ID
   */
  _self.next = function () {
    var d = new Date(),
      date = (d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 1)) * 1000;
    while (lastTime >= date) {
      date++;
    }
    lastTime = date;
    return date.toString(16);
  }
}
var versionAppend = function (extensions, options) {
  return map(function (file, cb) {
    var pJson, version, shortId;
    if (!file) {
      throw new PluginError('gulp-rev-append', 'Missing file option for gulp-version-append.');
    }
    if (!file.contents) {
      throw new PluginError('gulp-rev-append', 'Missing file.contents required for modifying files using gulp-rev-append.');
    }

    if (options) {
      if (options.appendType === 'timestamp') {
        version = (new Date()).getTime();
      } else if (options.appendType === 'guid') {
        shortId = new ShortId();
        version = shortId.next();
      } else {
        if (options.versionFile) {
          pJson = appRoot.require(options.versionFile)
        } else {
          pJson = appRoot.require('package.json')
        }
        version = pJson && pJson.version;
      }
    } else {
      pJson = appRoot.require('package.json');
      version = pJson && pJson.version;
    }
    if( !versionNumberCached ){
      versionNumberCached = version
    }else{
       version = versionNumberCached
    }
    file.contents = new Buffer(file.contents.toString().replace(defaults.versionRegex(extensions), '$1' + version));
    cb(null, file);
  });
}
var $ = gulpLoadPlugins()
var shellParams = {
  env: { FORCE_COLOR: true }
}
var errorLog = (message = 'Unknown', prefix = 'Error') => {
  prefix = prefix !== false ? $.util.colors.yellow(`[${prefix}] : `) : '';
  message = $.util.colors.red(`${message}\n`);

  return $.util.log(`${prefix}${message}`);
}
var errorHandler = function (error, prefix) {
  errorLog(error, prefix);
  this.emit('end');
}

gulp.task('sass', 
  function () {
    console.log('Compiling SCSS...');
    return gulp.src('./src/styles/sass/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('./public/src/styles/themes'));
  }
);

gulp.task('livereload-css',
  function () {
    console.log('reloading CSS...');
    gulp.src('./public/src/styles/themes/**/*.*').pipe(
      livereload({ start: true })
    );
  }
);

gulp.task('compile-sass-and-livereload',
  function () {
    runSequence('sass', 'livereload-css');
  }
);

gulp.task('sass-watch', 
  function () {
    console.log('Watching CSS for livereload...');
    livereload.listen();
    gulp.watch('./src/styles/sass/**/*.scss', ['compile-sass-and-livereload']);
  }
);

gulp.task('append-version-to-html-links',
  function(){
    return gulp.src('./src/*.html').pipe(
      versionAppend(['html', 'css', 'js'], {appendType: 'guid', versionFile: 'version.json'})
    ).pipe(
      gulp.dest('./public/')
    );
  }
);

gulp.task('minify-js-assets', 
  function() {
    /* IE scripts */
    gulp.src([
      './src/lib/respond.min.js',
      './src/lib/excanvas.min.js'
    ]).pipe(concat('scripts-ie.js')).pipe(gulp.dest('./public/src/lib/'))

    /* 1. part scripts */
    gulp.src([
      './src/lib/bootstrap/js/bootstrap.js',
      './src/lib/bootstrap-hover-dropdown/bootstrap-hover-dropdown.js', 
      './src/lib/jquery-slimscroll/jquery.slimscroll.js',
      './src/lib/jquery.blockui.min.js',
      './src/lib/jquery-ui/jquery-ui.min.js',
      './src/lib/js.cookie.min.js',
      './src/lib/bootstrap-switch/js/bootstrap-switch.js',
      './src/lib/select2/js/select2.full.js',
      './src/lib/moment.min.js',
      './src/lib/notific8.js',
      // './src/lib/pulsate.min.js',
    ])
    .pipe(concat('scripts-one.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/src/lib/'))

    /* 2. part scripts */
    gulp.src([
      './src/lib/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
      './src/lib/bootstrap-editable/bootstrap-editable/js/bootstrap-editable.js',
      './src/lib/dropzone/dropzone.min.js',
      './src/lib/jstree/jstree.min.js',
      './src/lib/afterglow/afterglow.min.js',
      './src/app/init.js',
      './src/app/layout.js',
      './src/app/sidebar.js',
    ])
    .pipe(concat('scripts-two.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/src/lib/'))
  }
);

gulp.task('start-react',
  () => gulp.src('.').pipe(
    $.plumber({ errorHandler })
  ).pipe(
    $.shell('node ./scripts/start.js', shellParams)
  )
);

gulp.task('build-react', 
  () => gulp.src('.').pipe(
    $.plumber({ errorHandler })
  ).pipe(
    $.shell('node ./scripts/build.js', shellParams)
  )
);

gulp.task('start', 
  function(cb) {
    runSequence(
      'append-version-to-html-links',
      'minify-js-assets',
      'sass',
      'sass-watch',
      'start-react', 
      cb
    );
  }
);

gulp.task('build',
  function(cb) {
    runSequence(
      'append-version-to-html-links',
      'minify-js-assets',
      'sass',
      'build-react',
      cb
    );
  }
);

