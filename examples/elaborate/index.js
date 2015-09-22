'use strict';

var resolverRevolver = require('resolver-revolver');
var argv = require('yargs').argv;
var negate = require('lodash.negate');
var isUndefined = require('lodash.isundefined');
var isDefined = negate(isUndefined);

var resolved = resolverRevolver.parse({
  // Add a console for logging
  console: console,

  // Our context
  context: {
    argv: argv,
    env: process.env
  },

  // Resolvables
  resolvables: {
    'environment': {
      from: ['argv.NODE_ENV', 'env.NODE_ENV'],
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
