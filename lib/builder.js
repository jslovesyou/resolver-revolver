'use strict';
var isNumber = require('lodash.isnumber');
var isString = require('lodash.isstring');
var isUndefined = require('lodash.isundefined');

module.exports = builder;

// functions
//
// Returns a function which sets a value in a tree defined by the pattern.
// The returned function will return the created tree.
// pattern is a string representation of an object path:
// For example: 'foo.bar.snafu'
function builder(pattern) {
  var args = Array.prototype.splice.call(arguments, 0);

  if (isUndefined(pattern)) {
    throw {
      name: 'Error',
      message: 'Expected pattern to be defined',
      arguments: args
    };
  } else if (!isNumber(pattern) && !isString(pattern)) {
    throw {
      name: 'Error',
      message: 'Expected pattern to be a number or a string, but got ' +
        'something else',
      arguments: args
    };
  }

  var context = {};
  var last;
  var head;
  var current = context;
  if (isNumber(pattern) || (isString(pattern) && pattern.indexOf('.') === -1)) {
    current[pattern] = {};
    last = current;
    head = pattern;
  } else {
    var parts = pattern.split('.');
    while (parts.length) {
      head = parts.shift();
      current[head] = {};
      last = current;
      current = current[head];
    }
  }

  return function (value) {
    last[head] = value;
    return context;
  };
}
