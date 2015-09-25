# resolver-revolver

## Setting a default fallback value

```js
// ./examples/defaults/index.js

'use strict';

var resolverRevolver = require('resolver-revolver');

var argv = require('yargs').argv;
var negate = require('lodash.negate');
var isUndefined = require('lodash.isundefined');
var isDefined = negate(isUndefined);

var resolved = resolverRevolver.parse({
  console: console,
  context: {
    argv: argv,
    env: process.env
  },
  resolvables: {
    'environment': {
      from: ['argv.NODE_ENV', 'env.NODE_ENV'],
      preconditions: [{
        fn: isDefined,
        name: 'is defined'
      }, {
        fn: function (environment) {
          return ['development', 'production', 'test']
            .indexOf(environment) !== -1;
        },
        name: 'is valid environment'
      }],
      default: 'development',
      throwOnNoResolution: true
    }
  }
});

var defaults = {
  environment: resolved.environment()
};

console.log(JSON.stringify(defaults, null, 4));

```

```zsh
$ node examples/defaults
```
