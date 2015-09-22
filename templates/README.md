# resolver-revolver

[![Codeship Status for sytac/gulp-commonjs-tasks](https://codeship.com/projects/fbd845d0-42d7-0133-683e-1e375ee071eb/status?branch=master)](https://codeship.com/projects/103903)

![guns-307948_1280](https://cloud.githubusercontent.com/assets/1814479/10014988/8cb934fc-611d-11e5-980f-94714994200b.png =250x)

## Description

Resolves values from and validates by trying to find values in given contexts in
a lazy way.

## Installation

```bash
$ npm install --save resolver-revolver
```

Since that is pretty generic, here's an example which resolves `NODE_ENV` from
either the command line, then from the system environment, and if all else fails
it will set it to a default of `development`.

*If you'd like to try these examples, please run `gulp prepare-examples` first*

<%= examples.easy.index %>

**Default value**

Since `argv.NODE_ENV` and `env.NODE_ENV` can not be resolved round-robin style,
the `default` will be resolved.

```bash
$ node examples/easy
{
    "environment": "development"
}
```

**Use a cli argument**

Since the first

```bash
$ node examples/easy --NODE_ENV=production
{
    "environment": "production"
}
```

**Export a system variable**

```bash
$ export NODE_ENV=coocoo
$ node examples/easy                           
{
    "environment": "coocoo"
}
```

**Provide a cli argument *and* export a system variable**

Since `argv.NODE_ENV` has a higher priority than `env.NODE_ENV`,
it will be resolved.

```bash
$ export NODE_ENV=coocoo
$ node examples/easy --NODE_ENV=production                          
{
    "environment": "production"
}
```

Savvy? Here's a more elaborate example.

<%= examples.elaborate.index %>

```bash
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

```bash
$ gulp test
```

Test reports are written to `./reports`.

## Contributing

-   Do pull requests.
-   Make sure there's tests and meaningful coverage.
-   Respect `./eslintrc`.
-   Issues should go in issues.
