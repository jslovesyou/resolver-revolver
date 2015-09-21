# resolver-revolver

Resolves values from and validates by trying to find values in given contexts.
Since that is pretty generic, here's an example.

```js
'use strict';

var argv = require('yargs').argv;
var negate = require('lodash/function/negate');
var resolverRevolver = require('../index');
var validator = require('validator');
var isUndefined = require('lodash/lang/isUndefined');

var validationContext = {
  process: {
    env: process.env
  },
  argv: argv
};

var validate = resolverRevolver.parse({
  context: validationContext,
  resolvables: {
    'bah': {
      from: ['argv.bah', 'argv.hi'],
      preconditions: [negate(isUndefined), validator.isNumeric]
    },
    'bar': {
      from: ['argv.bar', 'argv.barbar', 9000],
      preconditions: [{
        name: 'is defined',
        fn: negate(isUndefined)
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
        fn: negate(isUndefined)
      }, {
        name: 'is numeric',
        fn: validator.isNumeric
      }]
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
