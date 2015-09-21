'use strict';

var isArray = require('lodash/lang/isArray');
var isFunction = require('lodash/lang/isFunction');
var isObject = require('lodash/lang/isObject');
var isUndefined = require('lodash/lang/isUndefined');
var negate = require('lodash/function/negate');
var merge = require('lodash/object/merge');

var completion = {
  preconditions: preconditions,
  froms: froms
};

module.exports = completion;

// functions
function preconditions(setup, preconditions) {
  var defaultSetup = {
    defaultPrecondition: {
      fn: negate(isUndefined),
      name: 'is defined'
    },
    unknownPreconditionName: 'unknown precondition',
    console: {
      info: function () {},
      warn: function () {},
      error: function () {}
    }
  };

  setup = isObject(setup) ? merge({}, defaultSetup, setup) : defaultSetup;
  var error = setup.console.error;

  if (!isArray(preconditions)) {
    preconditions = [setup.defaultPrecondition];
  }

  preconditions = preconditions.map(function (precondition) {
    if (isFunction(precondition)) {
      precondition = {
        fn: precondition,
        name: setup.unknownPreconditionName
      };
    } else if (isObject(precondition)) {
      if (!isUndefined(precondition.fn)) {
        if (isUndefined(precondition.name)) {
          precondition.name = setup.unknownPreconditionName;
        }
      } else {
        error('Precondition.fn is not defined, skipping',
          JSON.stringify(precondition, null, 4)
        );
        precondition = undefined;
      }
    }

    return precondition;
  }).filter(function (precondition) {
    return !isUndefined(precondition);
  });

  return preconditions;
}


// Helper function which returns an array of
function froms(froms) {
  return froms.map(function (from) {
    return isObject(from) ?
      from : {
        target: from
      };
  });
}
