'use strict';

var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var gutil = require('gulp-util');

module.exports = function (gulp) {

  var paths = {
    reports: './reports/unit-test-coverage',
    src: ['index.js', 'lib/**/*.js'],
    specs: ['tests/**/*.spec.js'],
    watch: ['tests/**/tasks/*']
  };

  paths.watch = paths.watch.concat(paths.src);
  paths.watch = paths.watch.concat(paths.specs);

  var tasks = {
    mocha: _runner,
    test: {
      fn: mochaRunner,
      description: 'Run unit test',
      options: {
        '-w, --watch': 'Watch for changes and run tests again'
      }
    }
  };

  return tasks;

  // Does a switcheroo based on cli option --watch or -w
  function mochaRunner(done) {
    var cb = done;
    if (gutil.env.watch || gutil.env.w) {
      cb = function (err) {
        if (err) {
          done(err);
        } else {
          _watcher(done);
        }
      };
    }

    _runner(cb);
  }

  // Watch task
  function _watcher(done) {
    gulp.watch(paths.watch, ['mocha'])
      .on('end', function (err) {
        done(err);
      });
  }

  // Test runner
  function _runner(done) {

    gulp.src(paths.src)
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
      .on('finish', function () {
        gulp.src(paths.specs)
          .pipe(mocha({
            reporter: 'spec'
          }))
          .on('error', function (err) {
            console.error(err);
            this.emit('end');
          })
          .pipe(istanbul.writeReports({
            dir: paths.reports,
            reporters: ['lcov', 'json', 'text', 'text-summary'],
            reportOpts: {
              dir: paths.reports
            }
          }))
          .on('end', done);
      });
  }
};
