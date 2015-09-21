'use strict';

var parser = require('../../lib/parser');
var expect = require('expect.js');
var isNumber = require('lodash.isnumber');
var isString = require('lodash.isstring');
var negate = require('lodash.negate');
var isUndefined = require('lodash.isundefined');
var isDefined = negate(isUndefined);

describe('parser.parse', function () {
  describe('valid options', function () {

    var resolved = parser.parse({
      context: {
        foo: {
          ok: 'abc'
        },
        bar: {
          no: 666
        }
      },
      resolvables: {
        'foo.first': {
          from: ['foo.ok', 'bar.no'],
          preconditions: [isDefined, isNumber]
        },
        'foo.bar.second': {
          from: ['foo.ok', 'bar.no'],
          preconditions: [{
            name: 'is defined',
            fn: isDefined
          }, {
            name: 'isString',
            fn: isString
          }]
        },
        'foo.bar.cafebabe.third': {
          from: ['foo.ok', 'bar.no'],
          preconditions: [isUndefined]
        },
        'no.way.man': {
          from: ['foo.no', 'bar.ok']
        }
      }
    });

    it('should return an object', function () {
      expect(resolved).to.be.an('object');
    });

    it('should return an object', function () {
      expect(resolved.foo.first).to.be.a('function');
      expect(resolved.foo.bar.second).to.be.a('function');
      expect(resolved.foo.bar.cafebabe.third).to.be.a('function');
    });

    it('should return the right values', function () {
      expect(resolved.foo.first()).to.be(666);
      expect(resolved.foo.first()).not.to.be('abc');
      expect(resolved.foo.bar.second()).to.be('abc');
      expect(resolved.foo.bar.second()).not.to.be(666);

      expect(resolved.no.way.man()).to.be(undefined);
    });
  });

  describe('invalid options', function () {
    it('should throw', function () {
      try {
        parser.parse({

        });
      } catch (e) {
        console.log(e);
      }
    });

  });
});
