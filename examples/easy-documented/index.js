'use strict';

var resolverRevolver = require('resolver-revolver');
var isString = require('lodash.isstring');

// Get a reference to cli arguments
var argv = require('yargs').argv;

// Retrieve our resolved value tree
var resolved = resolverRevolver.parse({

  // Context is where there will be searched for values
  context: {
    argv: argv,
    env: process.env
  },

  // Resolvables
  resolvables: {
    // Name of resolvable
    'environment': {
      // Where we want to try to get our values from
      from: ['argv.NODE_ENV', 'env.NODE_ENV'],
      // If both of the above fail, we have a default value
      default: 'development'
    }
  }
});

var defaults = {
  environment: resolved.environment()
};

console.log(JSON.stringify(defaults, null, 4));
