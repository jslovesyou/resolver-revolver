'use strict';

var util = require('util');
var isUndefined = require('lodash.isundefined');
var merge = require('lodash.merge');
var every = require('lodash.every');
var first = require('lodash.first');
var isObject = require('lodash.isobject');

module.exports = validator;

function validator(setup, validatorSetup) {

  var args = Array.prototype.splice.call(arguments, 0);

  if (isUndefined(validatorSetup)) {
    throw {
      name: 'Error',
      message: 'Expected validatorSetup to be defined',
      arguments: args
    };
  } else if (!isObject(validatorSetup)) {
    throw {
      name: 'Error',
      message: 'Expected validatorSetup to be an object, ' +
        'but got something else',
      arguments: args
    };
  }

  var defaultSetup = {
    context: global,
    console: {
      info: function () {},
      error: function () {}
    },
    icons: {
      results: {
        valid: '✔',
        inValid: '✖',
        firstValidResultPrefix: '✊'
      }
    }
  };

  setup = isObject(setup) ? merge({}, defaultSetup, setup) : defaultSetup;

  var info = setup.console.info;
  var error = setup.console.error;
  var resolvableConfig = validatorSetup.resolvableConfig;
  info('Resolving:', resolvableConfig.name);

  var preconditions = resolvableConfig.preconditions;

  var resolvers = validatorSetup.resolvers();

  var results = resolvers.map(function (resolver) {

    var value = resolver.fn();

    var validationResults = resolve({
      preconditions: preconditions,
      resolver: resolver,
      value: value
    });

    var preconditionsMet =
      every(validationResults, function (validationResult) {
        return validationResult.result === true;
      });

    return {
      preconditionsMet: preconditionsMet,
      resolvedValue: value,
      validationResults: validationResults
    };
  });

  var isFirst = -1;
  var firstValidResult = first(results.filter(function (result, index) {

    if (result.preconditionsMet === true) {
      if (isFirst === -1) {
        isFirst = index;
      }
    }

    var prefix = ' ';
    if (result.preconditionsMet === true) {
      prefix += setup.icons.results.valid;
    } else {
      prefix += setup.icons.results.inValid;
    }


    if (isFirst === index) {
      prefix = setup.icons.results.firstValidResultPrefix + prefix;
    } else {
      prefix = ' ' + prefix;
    }

    var firstResult = result.validationResults[0];

    info(
      util.format('\t %s  (%s of %s) - %s: %s',
        prefix,
        index + 1,
        results.length,
        firstResult.resolver.from.target,
        firstResult.value
      )
    );

    result.validationResults.map(function (validationResult, validationIndex) {
      var preconditionPrefix = validationResult.result === true ? setup.icons.results.valid : setup.icons.results.inValid;
      info(
        util.format(
          '\t\t %s  (%s of %s) %s',
          preconditionPrefix,
          validationIndex + 1,
          result.validationResults.length,
          validationResult.precondition.name
        )
      );
    });
    return result.preconditionsMet;
  }));
  if (!isUndefined(firstValidResult)) {
    info(
      util.format(
        '\nResolved %s from %s to %s\n',
        resolvableConfig.name,
        firstValidResult.validationResults[0].resolver.from.target,
        firstValidResult.resolvedValue
      )
    );
    return firstValidResult.resolvedValue;
  } else {
    error(
      util.format(
        '\nCould not resolve %s',
        resolvableConfig.name
      )
    );
    if (resolvableConfig.throwOnNoResolution) {
      error(
        '.throwOnNoResolution is set to true, aborting'
      );
      throw {
        name: 'Error',
        message: '.throwOnNoResolution is set to true, aborting'
      };
    }
  }
}

function resolve(setup) {
  var preconditions = setup.preconditions;
  var resolver = setup.resolver;
  var value = setup.value;
  return preconditions.map(function (precondition, preconditionIndex) {
    var resolvedResult = precondition.fn.apply(null, [value]);
    return {
      value: value,
      result: resolvedResult,
      resolver: resolver,
      precondition: precondition,
      index: preconditionIndex
    };
  });
}
