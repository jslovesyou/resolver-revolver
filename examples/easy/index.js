'use strict';

var resolverRevolver = require('resolver-revolver');
var argv = require('yargs').argv;
var isString = require('lodash.isstring');

var resolved = resolverRevolver.parse({
  context: {
    argv: argv,
    env: process.env
  },
  resolvables: {
    'environment': {
      from: ['argv.NODE_ENV', 'env.NODE_ENV'],
      default: 'development'
    }
  }
});

var defaults = {
  environment: resolved.environment()
};

console.log(JSON.stringify(defaults, null, 4));
