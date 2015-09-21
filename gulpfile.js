var gulp = require('gulp'),
  path = require('path');

var taskLoader = require('gulp-commonjs-tasks/task-loader');

var tasks = taskLoader.load(path.join(__dirname, 'tasks'), gulp);

tasks
  .addHelpTask();
