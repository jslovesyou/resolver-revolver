'use strict';

var resolverRevolver = require('resolver-revolver');
var argv = require('yargs').argv;

var resolved = resolverRevolver.parse({
  context: {
    argv: argv,
    env: process.env
  },
  resolvables: {
    'environment': {
      default: 'development'
    }
  }
});

var defaults = {
  environment: resolved.environment()
};

console.log(JSON.stringify(defaults, null, 4));
