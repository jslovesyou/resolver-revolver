# resolver-revolver
[ ![Codeship Status for sytac/gulp-commonjs-tasks](https://codeship.com/projects/fbd845d0-42d7-0133-683e-1e375ee071eb/status?branch=master)](https://codeship.com/projects/103903)
[![Coverage Status](https://coveralls.io/repos/jslovesyou/resolver-revolver/badge.svg?branch=master&service=github)](https://coveralls.io/github/jslovesyou/resolver-revolver?branch=master)

Use as your own risk, this is a work in progress. It does exactly what it should
do for my current project, _and nothing more_.

Resolves values from and validates by trying to find values in given contexts.
Since that is pretty generic, here's an example.

```js
'use strict';

var argv = require('yargs').argv;
var negate = require('lodash.negate');
var resolverRevolver = require('../index');
var validator = require('validator');
var isUndefined = require('lodash.isundefined');
var isDefined = negate(isUndefined);

var validate = resolverRevolver.parse({
  console: console,
  context: {
    process: {
      env: process.env
    },
    argv: argv
  },
  resolvables: {
    'bah': {
      from: ['argv.bah', 'argv.hi'],
      preconditions: [isDefined, validator.isNumeric]
    },
    'bar': {
      from: ['argv.bar', 'argv.barbar', 9000],
      preconditions: [{
        name: 'is defined',
        fn: isDefined
      }, {
        name: 'validator.isNumeric',
        fn: validator.isNumeric
      }]
    },
    'foo.bar.snafu': {
      from: ['process.env.Foo', {
        target: 'argv.Foo',
        messages: {
          error: 'That did not work dude',
          success: 'That did work dude'
        }
      }, 'argv.foofoo', 9000],
      preconditions: [{
        name: 'is defined',
        fn: isDefined
      }, {
        name: 'is numeric',
        fn: validator.isNumeric
      }],
      throwOnFail: true
    }
  }
});

var defaults = {
  bah: validate.bah(),
  bar: validate.bar(),
  foo: {
    bar: {
      snafu: validate.foo.bar.snafu()
    }
  }
};

console.log(JSON.stringify(defaults, null, 4));

```

```bash
[examples] node example.js --Foo 123
{
    "bar": 9000,
    "foo": {
        "bar": {
            "snafu": 123
        }
    }
}

```
