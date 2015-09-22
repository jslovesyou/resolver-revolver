'use strict';

var isObject = require('lodash.isobject');
var isUndefined = require('lodash.isundefined');
var merge = require('lodash.merge');

var builder = require('./builder');
var walker = require('./walker');
var completion = require('./completion');
var validator = require('./validator');

module.exports = {
  parse: parse
};

function parse(setup) {
  var defaultSetup = {
    context: global,
    console: {
      info: function () {},
      error: function () {}
    }
  };

  setup = isObject(setup) ? merge({}, defaultSetup, setup) : defaultSetup;

  var error = setup.console.error;

  if (!isObject(setup.resolvables)) {
    error('Expected options.resolvables to be an object');
    throw 'Expected options.resolvables to be an object';
  }

  var boundCompletionPreconditions =
    completion.preconditions.bind(null, merge({
      console: setup.console
    }, setup.preconditions));

  var validationMap = merge
    .apply({}, Object.keys(setup.resolvables)
      .map(function (name) {
        var resolvableConfig = setup.resolvables[name];
        resolvableConfig.name = name;

        // clean up config
        // conditions
        resolvableConfig.preconditions =
          boundCompletionPreconditions(resolvableConfig.preconditions);
        var froms = [].concat(resolvableConfig.from);
        if (!isUndefined(resolvableConfig.default)) {
          froms.push({
            default: resolvableConfig.default,
            target: 'default value'
          });
        }
        resolvableConfig.from = completion.froms(froms);

        var boundValidator = validator.bind(null, setup, {
          resolvableConfig: resolvableConfig,
          resolvers: function () {
            // returns a list of resolvables
            return resolvableConfig
              .from
              .map(function (from) {
                // clones and adds a fn to resolvable
                var resolveFn;
                if (!isUndefined(from.default)) {
                  resolveFn = function () {
                    return from.default;
                  };
                } else {
                  resolveFn = walker.bind(walker, setup.context, from.target);
                }
                return merge({
                  fn: resolveFn
                }, {
                  from: from
                });
              });
          }
        });

        // builder creates tree from resolvable name
        // and adds resolve function at endpoint
        return builder(name)(boundValidator);
      }));

  return validationMap;
}
