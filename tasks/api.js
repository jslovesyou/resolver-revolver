'use strict';
var docco = require('gulp-docco');
module.exports = function (gulp) {
  var examples = {
    'api': {
      fn: apiTask,
      description: 'Outputs api documentation'
    }
  };

  return examples;

  function apiTask() {

    return gulp.src(['./index.js', './lib/**/*.js'])
      .pipe(docco())
      .pipe(gulp.dest('./docs/api'));
  }
};
