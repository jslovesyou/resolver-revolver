'use strict';
var isNumber = require('lodash.isnumber');
var isObject = require('lodash.isobject');
var isString = require('lodash.isstring');
var isUndefined = require('lodash.isundefined');

module.exports = walker;

// functions
//

// Walks down the context object looking for the value at the far end defined
// by pattern.
// pattern is a string representation of an object path:
// For example: 'foo.bar.snafu'
function walker(context, pattern) {
  var args = Array.prototype.splice.call(arguments, 0);

  if (isUndefined(context)) {
    throw {
      name: 'Error',
      message: 'Expected context to be defined',
      arguments: args
    };
  } else if (!isObject(context)) {
    throw {
      name: 'Error',
      message: 'Expected context to be an object, but got something else',
      arguments: args
    };
  }

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

  var current;
  if (isNumber(pattern)) {
    current = pattern;
  } else {
    var aborting = false;
    var parts = pattern.split('.');
    while (aborting === false && parts.length) {
      var head = parts.shift();
      current = context[head];
      if (!isUndefined(current)) {
        context = current;
      } else {
        current = undefined;
        aborting = true;
      }
    }
  }
  return current;
}
