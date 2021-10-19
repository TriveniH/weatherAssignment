'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  defaultAssets = require('./config/assets/default'),
  testAssets = require('./config/assets/test'),
  testConfig = require('./config/env/test'),
  glob = require('glob'),
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  pngquant = require('imagemin-pngquant'),
  wiredep = require('wiredep').stream,
  path = require('path'),
  endOfLine = require('os').EOL,
  plugins = gulpLoadPlugins({
    rename: {
      'gulp-angular-templatecache': 'templateCache'
    }
  }),
  del = require('del');

// Local settings
var changedTestFiles = [];

// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
  process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
  process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function() {

  var nodeVersions = process.versions;
  var debugArgument = '--debug';
  switch (nodeVersions.node.substr(0, 1)) {
    case '4':
    case '5':
    case '6':
      debugArgument = '--debug';
      break;
    case '7':
    case '8':
      debugArgument = '--inspect';
      break;
  }

  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: [debugArgument],
    ext: 'js,html',
    verbose: true,
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

// Nodemon task without verbosity or debugging
gulp.task('nodemon-nodebug', function() {
  return plugins.nodemon({
    script: 'server.js',
    ext: 'js,html',
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

// Watch Files For Changes
gulp.task('watch', function() {
  // Start livereload
  plugins.refresh.listen();

  // Add watch rules
  // gulp.watch(defaultAssets.server.views).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.server.allJS, ['eslint']).on('change', plugins.refresh.changed);

  if (process.env.NODE_ENV === 'production') {
    gulp.watch(defaultAssets.server.gulpConfig, ['eslint']);
    // gulp.watch(defaultAssets.client.views, ['templatecache']).on('change', plugins.refresh.changed);
  } else {
    gulp.watch(defaultAssets.server.gulpConfig, ['eslint']);
    // gulp.watch(defaultAssets.client.views).on('change', plugins.refresh.changed);
  }
});


// Mocha tests task
gulp.task('mocha', function (done) {
  var mongooseService = require('./config/lib/mongoose');
  var testSuites = changedTestFiles.length ? changedTestFiles : testAssets.tests.server;
  var error;

  // Connect mongoose
  mongooseService.connect(function (db) {
    // Load mongoose models
    mongooseService.loadModels();

    gulp.src(testSuites)
      .pipe(plugins.mocha({
        reporter: 'spec',
        timeout: 10000
      }))
      .on('error', function (err) {
        // If an error occurs, save it
        error = err;
      })
      .on('end', function () {
        mongooseService.disconnect(function (err) {
          if (err) {
            console.log('Error disconnecting from database');
            console.log(err);
          }

          return done(error);
        });
      });
  });
});


// ESLint JS linting task
gulp.task('eslint', function() {
  var assets = _.union(
    defaultAssets.server.gulpConfig,
    defaultAssets.server.allJS,
    defaultAssets.client.js,
    testAssets.tests.server,
    testAssets.tests.client,
    testAssets.tests.e2e
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

// Lint all JavaScript files.
gulp.task('lint', function(done) {
  runSequence('eslint', done);
});

// Copy local development environment config example
gulp.task('copyLocalEnvConfig', function() {
  var src = [];
  var renameTo = 'local-development.js';

  // only add the copy source if our destination file doesn't already exist
  if (!fs.existsSync('config/env/' + renameTo)) {
    src.push('config/env/local.example.js');
  }

  return gulp.src(src)
    .pipe(plugins.rename(renameTo))
    .pipe(gulp.dest('config/env'));
});

// Lint project files and minify them into two production files.
gulp.task('build', function(done) {
  runSequence('env:dev', 'lint', done);
});

// Run the project tests
gulp.task('test', function(done) {
  runSequence('env:test', 'test:server', 'nodemon', done);
});

gulp.task('test:server', function(done) {
  runSequence('env:test', ['copyLocalEnvConfig'], 'mocha', done);
});

// Watch all server files for changes & run server tests (test:server) task on changes
gulp.task('test:server:watch', function(done) {
  runSequence('test:server', 'watch:server:run-tests', done);
});

gulp.task('test:e2e', function(done) {
  runSequence('env:test', 'lint', 'nodemon', done);
});

gulp.task('test:coverage', function(done) {
  runSequence('env:test', ['copyLocalEnvConfig'], 'lint', 'mocha:coverage', done);
});

// Run the project in development mode with node debugger enabled
gulp.task('default', function(done) {
  runSequence('env:dev', ['copyLocalEnvConfig'], 'lint', ['nodemon', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function(done) {
  runSequence(['copyLocalEnvConfig'], 'build', 'env:prod', 'lint', ['nodemon-nodebug', 'watch'], done);
});
