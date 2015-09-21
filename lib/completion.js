'use strict';

var isArray = require('lodash.isarray');
var isFunction = require('lodash.isfunction');
var isObject = require('lodash.isobject');
var isString = require('lodash.isstring');
var isUndefined = require('lodash.isundefined');
var negate = require('lodash.negate');
var merge = require('lodash.merge');

var completion = {
  preconditions: preconditions,
  froms: froms
};

module.exports = completion;

// functions
function preconditions(setup, preconditions) {
  var args = Array.prototype.splice.call(arguments, 0);

  if (!isUndefined(setup) && !isObject(setup)) {
    throw {
      name: 'Error',
      message: 'Expected setup to be an object, but got something else',
      arguments: args
    };
  }

  if (!isUndefined(preconditions) && !isArray(preconditions)) {
    throw {
      name: 'Error',
      message: 'Expected preconditions to be an array, but got something else',
      arguments: args
    };
  }

  var defaultSetup = {
    defaultPrecondition: {
      fn: negate(isUndefined),
      name: 'is defined'
    },
    unknownPreconditionName: 'unknown precondition',
    console: {
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
        throw {
          name: 'Error',
          message: 'Expected an object containing function .fn, but is it ' +
            'not defined',
          arguments: args
        };
      }
    } else {
      throw {
        name: 'Error',
        message: 'Expected a function or an object containing function .fn, ' +
          'but got something else',
        arguments: args
      };
    }

    return precondition;
  }).filter(function (precondition) {
    return !isUndefined(precondition);
  });

  return preconditions;
}


// Helper function which returns an array of
function froms(froms) {
  var args = Array.prototype.splice.call(arguments, 0);
  if (isUndefined(froms)) {
    throw {
      name: 'Error',
      message: 'Expected an array, but received no arguments'
    };
  }
  if (!isArray(froms)) {
    throw {
      name: 'Error',
      message: 'Argument is not an array',
      arguments: args
    };
  }

  return froms.map(function (from) {

    if (isObject(from)) {
      if (!isString(from.target)) {
        throw {
          name: 'Error',
          message: 'from.target is not a string',
          arguments: args
        };
      }
      return from;
    } else {
      return {
        target: from
      };
    };
  });
}
