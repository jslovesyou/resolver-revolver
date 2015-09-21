'use strict';

var walker = require('../lib/walker');
var expect = require('expect.js');

describe('walker', function () {
  it('should be a function', function () {
    expect(walker)
      .to.be.a('function');
  });

  it('should throw when context argument is not defined', function () {
    var hasThrown = false;
    try {
      walker();
    } catch (e) {
      hasThrown = true;
      expect(e).to.be.an('object');
      expect(e.name).to.be.a('string');
      expect(e.name).to.be('Error');
      expect(e.message).to.be.a('string');
      expect(e.message).to.be('Expected context to be defined');
      expect(e.arguments).to.be.an('array');
      expect(e.arguments.length).to.be(0);
    }

    expect(hasThrown).to.be(true);
  });

  it('should throw when context argument is not an object', function () {
    var hasThrown = false;
    var stringArgument = 'stringArgument';
    try {
      walker(stringArgument);
    } catch (e) {
      hasThrown = true;
      expect(e).to.be.an('object');
      expect(e.name).to.be.a('string');
      expect(e.name).to.be('Error');
      expect(e.message).to.be.a('string');
      expect(e.message).to.be('Expected context to be an object, but got ' +
        'something else');
      expect(e.arguments).to.be.an('array');
      expect(e.arguments.length).to.be(1);
      expect(e.arguments[0]).to.be.a('string');
      expect(e.arguments[0]).to.be(stringArgument);
    }

    expect(hasThrown).to.be(true);
  });

  it('should throw when pattern argument is not defined', function () {
    var hasThrown = false;
    try {
      walker({});
    } catch (e) {
      hasThrown = true;
      expect(e).to.be.an('object');
      expect(e.name).to.be.a('string');
      expect(e.name).to.be('Error');
      expect(e.message).to.be.a('string');
      expect(e.message).to.be('Expected pattern to be defined');
      expect(e.arguments).to.be.an('array');
      expect(e.arguments.length).to.be(1);
    }

    expect(hasThrown).to.be(true);
  });

  it('should throw when pattern argument is not a string or a ' +
    'number',
    function () {
      var hasThrown = false;
      var arrayArgument = ['arrayArgument'];
      try {
        walker({}, arrayArgument);
      } catch (e) {
        hasThrown = true;
        expect(e).to.be.an('object');
        expect(e.name).to.be.a('string');
        expect(e.name).to.be('Error');
        expect(e.message).to.be.a('string');
        expect(e.message).to.be('Expected pattern to be a number or a ' +
          'string, but got something else');
        expect(e.arguments).to.be.an('array');
        expect(e.arguments.length).to.be(2);
        expect(e.arguments[1]).to.be.an('array');
        expect(e.arguments[1]).to.be(arrayArgument);
      }

      expect(hasThrown).to.be(true);
    });

  it('should return the same number when pattern argument is ' +
    'a number',
    function () {

      var numberArgument = 1234;
      var value = 5678;
      var context = {
        1234: value
      };

      var result = walker(context, numberArgument);
      expect(result).to.be.a('number');
      expect(result).to.be(numberArgument);
    });

  it('should return the corresponding value from the context when pattern ' +
    'argument is a string',
    function () {

      var stringArgument = '1234';
      var value = 5678;
      var context = {
        '1234': value
      };

      var result = walker(context, stringArgument);
      expect(result).to.be.a('number');
      expect(result).to.be(value);
    });

  it('should return the corresponding value from the context when pattern ' +
    'argument is a string containing a path',
    function () {

      var stringArgument = 'foo.bar.snafu';
      var value = 5678;
      var context = {
        foo: {
          bar: {
            snafu: value
          }
        }
      };

      var result = walker(context, stringArgument);
      expect(result).to.be.a('number');
      expect(result).to.be(value);
    });

  it('should return undefined from the context when pattern ' +
    'argument has no result',
    function () {

      var stringArgument = 'one.two.three';
      var value = 5678;
      var context = {
        foo: {
          bar: {
            snafu: value
          }
        }
      };

      var result = walker(context, stringArgument);
      expect(result).to.be.a('undefined');
    });
});
