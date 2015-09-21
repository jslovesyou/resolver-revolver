'use strict';
var isNumber = require('lodash/lang/isNumber');
var isString = require('lodash/lang/isString');
var isUndefined = require('lodash/lang/isUndefined');

module.exports = walker;

// functions
//

// Walks down the context object looking for the value at the far end defined
// by pattern.
// pattern is a string representation of an object path:
// For example: 'foo.bar.snafu'
function walker(context, pattern) {
  var current;
  if (isNumber(pattern) || (isString(pattern) && pattern.indexOf('.') === -1)) {
    current = pattern;
  } else {
    var parts = pattern.split('.');
    while (parts.length) {
      var head = parts.shift();
      current = context[head];
      if (!isUndefined(current)) {
        context = current;
      }
    }
  }
  return current;
}
