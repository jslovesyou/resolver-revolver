'use strict';
var isNumber = require('lodash/lang/isNumber');
var isString = require('lodash/lang/isString');
var isUndefined = require('lodash/lang/isUndefined');

module.exports = builder;

// functions
//
// Returns a function which sets a value in a tree defined by the pattern.
// The returned function will return the created tree.
// pattern is a string representation of an object path:
// For example: 'foo.bar.snafu'
function builder(pattern) {
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
      if (isUndefined(current[head])) {
        current[head] = {};
        last = current;
      }
      current = current[head];
    }
  }

  return function (value) {
    last[head] = value;
    return context;
  };
}
