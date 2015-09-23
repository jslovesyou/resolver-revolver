'use strict';

var resolverRevolver = require('resolver-revolver');
var argv = require('yargs').argv;

var resolved = resolverRevolver.parse({
  console: console,
  icons: {
    results: {
      valid: '🔵',
      inValid: '🔴',
      firstValidResultPrefix: '🔵'
    }
  },
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
