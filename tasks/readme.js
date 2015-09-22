'use strict';

var camelCase = require('lodash.camelcase');
var fs = require('fs');
var globule = require('globule');
var gulpTemplate = require('gulp-template');
var gutil = require('gulp-util');
var isArray = require('lodash.isarray');
var isFunction = require('lodash.isfunction');
var path = require('path');
var remove = require('lodash.remove');
var template = require('lodash.template');

module.exports = function (gulp) {
  var tasks = {
    createReadme: _readme,
    readme: {
      fn: readme.bind(null, _readme, _watcher),
      dep: ['createReadme'],
      description: 'Creates readme file',
      options: {
        '-w, --watch': 'Watches changes and create README and ./docs again'
      }
    }
  };

  return tasks;

  // Does a switcheroo based on cli option --watch or -w
  function readme(worker, watcher, done) {
    var cb = done;
    if (gutil.env.watch || gutil.env.w) {
      cb = function (err) {
        if (err) {
          done(err);
        } else {
          watcher(done);
        }
      };
    }

    worker(cb);
  }

  // Watch task
  function _watcher(done) {
    gulp.watch(['./tasks/*.js', './*.js', './examples/**/*.js',
        './templates/**/*.md'
      ], ['createReadme'])
      .on('end', function (err) {
        done(err);
      });
  }


  function _readme(done) {
    var taskInfo = require('gulp-commonjs-tasks/task-info')(gulp);
    var taskTree = taskInfo.taskTree();

    var current,
      templateData = {
        k: taskTree,
        package: require('../package.json')
      };

    [{
      base: './',
      src: ['tasks/**/*.js', '*.js'],
      namespace: 'js',
      wrapper: function (rendered, config) {
        return ['```js', '// ' + config.file + '\n', rendered, '```'].join(
          '\n');
      }
    }, {
      base: './examples/',
      src: ['**/*.js', '**/*.json', '!**/node_modules/**/*.js'],
      namespace: 'examples',
      wrapper: function (rendered, config) {
        return ['```js', '// ' + config.file + '\n', rendered, '```'].join(
          '\n');
      }
    }].map(function (parseable) {

      var patterns, source;

      if (parseable.namespace && !templateData[parseable.namespace]) {
        templateData[parseable.namespace] = {};
        current = templateData[parseable.namespace];
      } else {
        current = templateData;
      }

      source = isArray(parseable.src) ? parseable.src : [parseable
        .src
      ];

      patterns = source.map(function (src) {
        if (src.indexOf('!') === 0) {
          return '!' + parseable.base + src.substring(1);
        } else {
          return parseable.base + src;
        }
      });

      globule.find(patterns)
        .map(function (file) {
          var pathArrays = remove(path.relative(parseable.base,
                path.dirname(
                  file))
              .split(path.sep),
              function (pathPart) {
                if (pathPart !== '') {
                  return true;
                }
              })
            .map(camelCase);

          return {
            parseable: parseable,
            file: file,
            depth: pathArrays
          };
        })
        .sort(function (a, b) {
          if (a.depth.length === b.depth.length) {
            return 0;
          } else if (a.depth.length > b.depth.length) {
            return -1;
          } else {
            return 1;
          }
        })
        .map(function (config) {
          var basename, local, rendered, value;

          basename = camelCase(path.basename(config.file, path
            .extname(
              config.file)));

          local = current;

          config.depth
            .map(function (part) {
              if (part !== '') {
                if (!local[part]) {
                  local[part] = {};
                }
                local = local[part];
              }
            });

          value = fs.readFileSync(config.file, 'utf8');

          try {
            rendered = template(value)(templateData);

            if (isFunction(config.parseable.wrapper)) {
              rendered = config.parseable.wrapper(rendered, config);
            }
            local[basename] = rendered;
          } catch (err) {
            // gracefully fail missing objects
            console.log('---', err, 'in', config.file);
          }

          return config;
        });
    });

    gulp.src(['./templates/**/*.md'], {
        cwd: './'
      })
      .pipe(gulpTemplate(templateData))
      .pipe(gulp.dest('./')).on('end', function (err) {
        done(err);
      });
  }
};
