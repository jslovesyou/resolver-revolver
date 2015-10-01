# resolver-revolver

[![Codeship Status for sytac/gulp-commonjs-tasks](https://codeship.com/projects/fbd845d0-42d7-0133-683e-1e375ee071eb/status?branch=master)](https://codeship.com/projects/103903)

![revolver](https://cloud.githubusercontent.com/assets/1814479/10023500/bad1db20-6152-11e5-8bfd-731c91466b8b.png)

## Description

Resolves values from and validates by trying to find values in given contexts in
a lazy way.

## Installation

```zsh
$ npm install --save resolver-revolver
```

Since that is pretty generic, here's an example which resolves `NODE_ENV` from
either the command line, then from the system environment, and if all else fails
it will set it to a default of `development`.

*If you'd like to try these examples, please run `gulp prepare-examples` first*

```js
// ./examples/easy/index.js

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

```

**Default value**

Since `argv.NODE_ENV` and `env.NODE_ENV` can not be resolved round-robin style,
the `default` will be resolved.

```zsh
$ node examples/easy
{
    "environment": "development"
}
```

**Use a cli argument**

Since the first

```zsh
$ node examples/easy --NODE_ENV=production
{
    "environment": "production"
}
```

**Export a system variable**

```zsh
$ export NODE_ENV=coocoo
$ node examples/easy                           
{
    "environment": "coocoo"
}
```

**Provide a cli argument *and* export a system variable**

Since `argv.NODE_ENV` has a higher priority than `env.NODE_ENV`,
it will be resolved.

```zsh
$ export NODE_ENV=coocoo
$ node examples/easy --NODE_ENV=production                          
{
    "environment": "production"
}
```

Savvy? Here's a more elaborate example.

```js
// ./examples/elaborate/index.js

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

```

```zsh
$ unset NODE_ENV
$ node examples/elaborate --NODE_ENV asdasd
Resolving: environment
    ✖ (1 of 3) - argv.NODE_ENV: asdasd
      ✔ (1 of 2) is defined
      ✖ (2 of 2) is an enviroment
    ✖ (2 of 3) - env.NODE_ENV: undefined
      ✖ (1 of 2) is defined
      ✖ (2 of 2) is an enviroment
  ✊✔ (3 of 3) - default value: development
      ✔ (1 of 2) is defined
      ✔ (2 of 2) is an enviroment

Resolved environment from default value to development

{
    "environment": "development"
}

```

## Running tests

```zsh
$ gulp test
```

Test reports are written to `./reports`.

## Contributing

-   Do pull requests.
-   Make sure there's tests and meaningful coverage.
-   Respect `./eslintrc`.
-   Issues should go in issues.
