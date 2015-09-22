'use strict';
var symlink = require('gulp-symlink');
var util = require('util');
module.exports = function (gulp) {
  var examples = {
    'prepare-examples': {
      fn: prepareTask,
      description: 'Prepares examples for usage.'
    }
  };

  return examples;

  function prepareTask() {
    var pkg = require('../package.json');
    return gulp.src('./')
      .pipe(symlink(util.format('./node_modules/%s', pkg.name), {
        force: true
      }));
  }
};
