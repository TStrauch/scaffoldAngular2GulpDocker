'use strict';

/*
  for builds:
  - cssmin
  - imagemin
  - uglify & minify
  - concat
  Goal: get all templates and styles included into the .component.ts/js files. once this is done
  it should be possible to concat and minify/uglify all js files (js needs to be transpiled from ts before)
  The rest is just like in grunt: copy and minify ressources.
*/

var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    Config = require('./gulpfile.config'),
    // tsProject = tsc.createProject('tsconfig.json'),
    // browserSync = require('browser-sync'),
    browserSync = require('browser-sync').create(),
    superstatic = require( 'superstatic' ),
    modRewrite  = require('connect-modrewrite'),
    inlineNg2Template = require('gulp-inline-ng2-template'),
    uglify = require('gulp-uglify'),
    wiredep = require('wiredep').stream;

var fs = require('fs');
var path = require('path');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var merge = require('merge-stream');

var usemin = require('gulp-usemin');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-clean-css');
var rev = require('gulp-rev');

var less = require('gulp-less');

var config = new Config();

/**
  ********************************************************
  *** general tasks
  ********************************************************
*/
gulp.task('wiredep', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('./app'));
});

gulp.task('less', function () {
  gulp.src('./app/**/*.less', {base: './app'})
    .pipe(less())
    .pipe(gulp.dest( './app' ));
});
/**
  ********************************************************
  ***Development server with watch and livereload
  ********************************************************
*/

gulp.task('serve',['wiredep', 'less'], function() {
  process.stdout.write('Starting browserSync and superstatic...\n');
  // browserSync({
  //   port: 3000,
  //   browser: ["google chrome"],
  //   files: ['index.html', '**/*.js'],
  //   injectChanges: true,
  //   logFileChanges: false,
  //   logLevel: 'silent',
  //   logPrefix: 'angularin20typescript',
  //   notify: true,
  //   reloadDelay: 0,
  //   server: {
  //     baseDir: './app',
  //     middleware: [
  //       modRewrite([
  //         '!\\.\\w+$ /index.html [L]'
  //       ]),
  //       superstatic({ debug: false})
  //     ]
  //   }
  // });
    browserSync.init({
      browser: ["google chrome"],
      server: {
        baseDir: './app',
        middleware: [
          modRewrite([
            '!\\.\\w+$ /index.html [L]'
          ]),
          superstatic({ debug: false})
        ]
      }
    });
      gulp.watch('./app/**/*.js').on('change', browserSync.reload);
      gulp.watch('./app/**/*.less', ['less']);
      gulp.watch('./app/**/*.css').on('change', browserSync.reload);
      gulp.watch('./app/**/*.html').on('change', browserSync.reload);
});


/**
  ********************************************************
  *** Build
  ********************************************************
*/

//clean build directories
gulp.task('del', function(){
  return del.sync([
    './app/.tmp',
    './dist'
  ]);
});

//make angular templates (html, css) inline
gulp.task('inline-templates',['less'], function() {
  return gulp.src('./app/js/**/*.js')
    .pipe(inlineNg2Template({
      base: '/app',
      target: 'es5',
      useRelativePaths: false
    }))
    .pipe(gulp.dest('./app/.tmp/js'));
});

//compress js files in .tmp
function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('uglify-components',['inline-templates'], function(){
  var srcDir = './app/.tmp/js';

  var folders = getFolders('./app/.tmp/js');

  var tasks = folders.map(function(folder) {
    return gulp.src(path.join(srcDir, folder, '/**/*.js'))
        // concat into foldername.js
        // .pipe(concat(folder + '.component.js'))
        // // write to output
        // .pipe(gulp.dest('./app/.tmp'))
        // minify

        .pipe(uglify())

        // rename to folder.min.js
        // .pipe(rename(folder + '.component.js'))
        // write to output again
        .pipe(gulp.dest('./dist/js/'+folder));

  });

  var root = gulp.src(path.join(srcDir, '/*.js'))
        // .pipe(concat('main.js'))
        // .pipe(gulp.dest('./app/.tmp'))

        .pipe(uglify())

        // .pipe(rename('main.js'))
        .pipe(gulp.dest('./dist/js'));

  return merge(tasks, root);

})

//usemin
gulp.task('usemin',['wiredep'], function() {
  return gulp.src('./app/*.html')
    .pipe(usemin({
      css: [ rev() ],
      // html: [ minifyHtml({ empty: true }) ],
      // js: [ uglify(), rev() ],
      js: [ rev() ],
      // inlinejs: [ uglify() ],
      // inlinecss: [ minifyCss(), 'concat' ]
    }))
    .pipe(gulp.dest('./dist/'));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src([
      './bower_components/font-awesome/fonts/fontawesome-webfont.*'])
      .pipe(gulp.dest('./dist/fonts/'));
});

// Images --> not yet used!
// gulp.task('images', function () {
//     return gulp.src([
//     		'app/images/**/*',
//     		'app/lib/images/*'])
//         .pipe($.cache($.imagemin({
//             optimizationLevel: 3,
//             progressive: true,
//             interlaced: true
//         })))
//         .pipe(gulp.dest('dist/images'))
//         .pipe($.size());
// });

gulp.task('copy', function(){
  return gulp.src('./app/lib/**/*')
    .pipe(gulp.dest('./dist/lib'));
});

gulp.task('build', ['del', 'wiredep', 'less', 'inline-templates', 'usemin', 'uglify-components', 'fonts', 'copy'], function(){
  process.stdout.write('Building...\n');
});
gulp.task('serve:dist', function() {
  browserSync.init({
    browser: ["google chrome"],
    server: {
      baseDir: './dist',
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
        // superstatic({ debug: false})
      ]
    }
  });
});
