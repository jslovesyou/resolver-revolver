'use strict';

var util = require('util');
var isUndefined = require('lodash.isundefined');
var merge = require('lodash.merge');
var every = require('lodash.every');
var first = require('lodash.first');
var isObject = require('lodash.isobject');

module.exports = validator;

// functions
/*
{   "resolvers" : function(){ return []; },
    "resolvableConfig": {
        "from": [
            {
                "target": "process.env.Foo"
            },
            {
                "target": "argv.Foo",
                "messages": {
                    "error": "That did not work dude",
                    "success": "That did work dude"
                }
            },
            {
                "target": "argv.foofoo"
            },
            {
                "target": 9000
            }
        ],
        "preconditions": [
            {
                "name": "is defined"
            },
            {
                "name": "is numeric"
            }
        ],
        "throwOnFail": true,
        "name": "foo.bar.snafu"
    }
}

{
  resolvableConfig : {
    name: 'some name',
    preconditions: []
  },
  resolvers : function(){ return []; }
}
 */
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

    var prefix = result.preconditionsMet ? '✔' : '✖';
    prefix = (isFirst === index ? '✊' : ' ') + '  ' + prefix;
    var firstResult = result.validationResults[0];

    info(
      util.format('\t %s (%s of %s) - %s: %s',
        prefix,
        index + 1,
        results.length,
        firstResult.resolver.from.target,
        firstResult.value
      )
    );

    result.validationResults.map(function (validationResult, validationIndex) {
      var preconditionPrefix = validationResult.result === true ? '✔' : '✖';
      info(
        util.format(
          '\t\t %s (%s of %s) %s',
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
        '\nCould not resolve %s\n',
        resolvableConfig.name
      )
    );
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
