var every = require('lodash/collection/every');
var first = require('lodash/array/first');
var isArray = require('lodash/lang/isArray');
var isNumber = require('lodash/lang/isNumber');
var isFunction = require('lodash/lang/isFunction');
var isObject = require('lodash/lang/isObject');
var isString = require('lodash/lang/isString');
var isUndefined = require('lodash/lang/isUndefined');
var merge = require('lodash/object/merge');
var negate = require('lodash/function/negate');

module.exports = {
  parse: parse
};

function completePreconditions(setup, preconditions) {
  var defaultSetup = {
    defaultPrecondition: {
      fn: negate(isUndefined),
      name: 'is defined'
    },
    unknownPreconditionName: 'unknown precondition'
  };

  setup = isObject(setup) ? merge({}, defaultSetup, setup) : defaultSetup;

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
        console.warn('Precondition.fn is not defined, skipping');
        precondition = undefined;
      }
    }

    return precondition;
  }).filter(function (precondition) {
    return !isUndefined(precondition);
  });

  console.log('preconditions', JSON.stringify(preconditions, null, 4));
  return preconditions;
}

// Helper function which returns an array of
function completeFroms(froms) {
  return froms.map(function (from) {
    return isObject(from) ?
      from : {
        target: from
      };
  });
}

function parse(setup) {
  var defaultSetup = {
    context: global
  };

  setup = isObject(setup) ? merge({}, defaultSetup, setup) : defaultSetup;
  // console.log('setup', setup);
  if (!isObject(setup.resolvables)) {
    throw 'Expected options.to to be an object';
  }

  var boundCompletePreconditions =
    completePreconditions.bind(null, setup.preconditions);

  var validationMap = merge
    .apply({}, Object.keys(setup.resolvables)
      .map(function (name) {
        var resolvableConfig = setup.resolvables[name];
        resolvableConfig.name = name;

        // clean up config
        // conditions
        resolvableConfig.preconditions =
          boundCompletePreconditions(resolvableConfig.preconditions);
        resolvableConfig.from = completeFroms(resolvableConfig.from);

        var boundValidator = validator.bind(null, {
          resolvableConfig: resolvableConfig,
          resolvers: function () {
            // returns a list of resolvables
            return resolvableConfig
              .from
              .map(function (from) {
                // clones and adds a fn to resolvable
                return merge({
                  fn: _walker.bind(_walker, setup.context, from.target)
                }, {
                  from: from
                });
              });
          },
          setup: setup
        });

        // builder creates tree from resolvable name
        // and adds resolve function at endpoint
        return _builder(name)(boundValidator);
      }));

  return validationMap;
}

function validator(validatorSetup) {
  var resolvableConfig = validatorSetup.resolvableConfig;

  var preconditions = resolvableConfig.preconditions;

  var resolvers = validatorSetup.resolvers();

  var results = resolvers.map(function (resolver) {

    var value = resolver.fn();

    var validationResults = resolve({
      preconditions: preconditions,
      resolver: resolver,
      value: resolver.fn()
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

  var firstValidResult = first(results.filter(function (result) {
    var isFirst = false;

    if (result.preconditionsMet === true) {
      if (isFirst === false) {
        isFirst = true;
      }
      // console.log('yes');

    } else {
      // console.log('no');
    }
    return result.preconditionsMet;
  }));
  if (!isUndefined(firstValidResult)) {
    return firstValidResult.resolvedValue;
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

// Returns a function which sets a value in a tree defined by the pattern.
// The returned function will return the created tree.
// pattern is a string representation of an object path:
// For example: 'foo.bar.snafu'
function _builder(pattern) {
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

// Walks down the context object looking for the value at the far end defined
// by pattern.
// pattern is a string representation of an object path:
// For example: 'foo.bar.snafu'
function _walker(context, pattern) {
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
