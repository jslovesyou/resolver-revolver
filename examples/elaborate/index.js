'use strict';

var resolverRevolver = require('resolver-revolver');
var argv = require('yargs').argv;
var negate = require('lodash.negate');
var isUndefined = require('lodash.isundefined');
var isDefined = negate(isUndefined);

var resolved = resolverRevolver.parse({
  // Add a console for logging
  // defaults to undefined
  console: console,

  // Our context
  // defaults to {}
  context: {
    argv: argv,
    env: process.env
  },

  // when set to true it returns the default without validating
  lenientDefaults: false,

  // Resolvables
  resolvables: {
    'environment': {
      // defaults to []
      from: ['argv.NODE_ENV', 'env.NODE_ENV'],
      // defaults to undefined
      default: 'development',

      // And preconditions. If you do not set this array, it will default to
      // [isDefined].
      //
      // A precondition can be a function or an object containing a function and
      // name like so:
      // {
      //  fn: isDefined,
      //  name: 'is defined'
      // }
      //
      // Let's add our own here
      // defaults to []
      preconditions: [{
        fn: isDefined,
        name: 'is defined'
      }, {
        fn: function (value) {
          return ['development', 'production', 'test'].indexOf(value) !== -1;
        },
        name: 'is an enviroment'
      }]
    }
  }
});

var defaults = {
  // call resolved.environment function
  environment: resolved.environment()
};

console.log(JSON.stringify(defaults, null, 4));
