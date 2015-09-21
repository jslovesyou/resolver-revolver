'use strict';

var completion = require('../../lib/completion');
var expect = require('expect.js');

describe('completion.preconditions', function () {

  it('should contain .preconditions', function () {
    expect(completion.preconditions).to.be.a('function');
  });

  it('should throw when first argument is set yet not an object', function () {
    var hasThrown = false;
    var stringArgument = 'stringArgument';
    try {
      completion.preconditions(stringArgument);
    } catch (e) {
      hasThrown = true;
      expect(e).to.be.an('object');
      expect(e.name).to.be.a('string');
      expect(e.name).to.be('Error');
      expect(e.message).to.be.a('string');
      expect(e.message).to.be('Expected setup to be an object, but got ' +
        'something else');
      expect(e.arguments).to.be.an('array');
      expect(e.arguments.length).to.be(1);
      expect(e.arguments[0]).to.be.a('string');
      expect(e.arguments[0]).to.be(stringArgument);
    }

    expect(hasThrown).to.be(true);
  });

  it('should throw with non array preconditions argument', function () {
    var stringArgument = 'stringArgument';
    var hasThrown = false;
    try {
      completion.preconditions(undefined, stringArgument);
    } catch (e) {
      hasThrown = true;
      expect(e).to.be.an('object');
      expect(e.name).to.be.a('string');
      expect(e.name).to.be('Error');
      expect(e.message).to.be.a('string');
      expect(e.message).to.be('Expected preconditions to be an array, but ' +
        'got something else');
      expect(e.arguments).to.be.an('array');
      expect(e.arguments.length).to.be(2);
      expect(e.arguments[1]).to.be.a('string');
      expect(e.arguments[1]).to.be(stringArgument);
    }
    expect(hasThrown).to.be(true);
  });

  it('should return an array when called with empty array argument',
    function () {
      var results = completion.preconditions();
      expect(results).to.be.an('array');
      expect(results.length).to.be(1);
      expect(results[0]).to.be.an('object');
      expect(results[0].fn).to.be.a('function');
      expect(results[0].name).to.be.a('string');
    }
  );

  it('should return an array with a precondition when the preconditions ' +
    'argument is an array with a function',
    function () {
      var preconditionName = 'unknownPreconditionName';
      var setup = {
        unknownPreconditionName: preconditionName
      };
      var precondition = function () {};
      var arrayArgument = [precondition];
      var results = completion.preconditions(setup, arrayArgument);
      expect(results).to.be.an('array');
      expect(results.length).to.be(1);
      expect(results[0]).to.be.an('object');
      expect(results[0].fn).to.be.a('function');
      expect(results[0].fn).to.be(precondition);
      expect(results[0].name).to.be.a('string');
      expect(results[0].name).to.be(preconditionName);
    }
  );

  it('should return an array when calling with setup argument only',
    function () {
      var precondition = function () {};
      var preconditionName = 'preconditionName';
      var setup = {
        defaultPrecondition: {
          fn: precondition,
          name: preconditionName
        }
      };

      var results = completion.preconditions(setup);
      expect(results).to.be.an('array');
      expect(results.length).to.be(1);
      expect(results[0]).to.be.an('object');
      expect(results[0].fn).to.be.a('function');
      expect(results[0].fn).to.be(precondition);
      expect(results[0].name).to.be.a('string');
      expect(results[0].name).to.be(preconditionName);
    }
  );

  it('should return an array with a precondition containing .name and .fn ' +
    'when the preconditions argument is an array with an object containing ' +
    'function .fn',
    function () {
      var precondition = function () {};
      var preconditionName = 'preconditionName';
      var setup = {
        unknownPreconditionName: preconditionName
      };

      var preconditions = [{
        fn: precondition
      }];

      var results = completion.preconditions(setup, preconditions);
      expect(results).to.be.an('array');
      expect(results.length).to.be(1);
      expect(results[0]).to.be.an('object');
      expect(results[0].fn).to.be.a('function');
      expect(results[0].fn).to.be(precondition);
      expect(results[0].name).to.be.a('string');
      expect(results[0].name).to.be(preconditionName);
    }
  );

  it('should throw when preconditions argument array holds an empty object ' +
    'without fn',
    function () {
      var preconditions = [{}];
      var setup = undefined;
      var hasThrown = false;
      try {
        completion.preconditions(setup, preconditions);
      } catch (e) {
        hasThrown = true;
        expect(e).to.be.an('object');
        expect(e.name).to.be.a('string');
        expect(e.name).to.be('Error');
        expect(e.message).to.be.a('string');
        expect(e.message).to.be('Expected an object containing function .fn, ' +
          'but is it not defined');
        expect(e.arguments).to.be.an('array');
        expect(e.arguments.length).to.be(2);
        expect(e.arguments[0]).to.be(setup);
        expect(e.arguments[1]).to.be.an('array');
        expect(e.arguments[1]).to.be(preconditions);
      }
      expect(hasThrown).to.be(true);
    }
  );

  it('should throw when preconditions argument array holds anything other ' +
    'than a function or an object',
    function () {
      var stringPrecondition = 'stringPrecondition';
      var preconditions = [stringPrecondition];
      var setup = undefined;
      var hasThrown = false;
      try {
        completion.preconditions(setup, preconditions);
      } catch (e) {
        hasThrown = true;
        expect(e).to.be.an('object');
        expect(e.name).to.be.a('string');
        expect(e.name).to.be('Error');
        expect(e.message).to.be.a('string');
        expect(e.message).to.be('Expected a function or an object containing ' +
          'function .fn, but got something else');
        expect(e.arguments).to.be.an('array');
        expect(e.arguments.length).to.be(2);
        expect(e.arguments[0]).to.be(setup);
        expect(e.arguments[1]).to.be.an('array');
        expect(e.arguments[1]).to.be(preconditions);
      }
      expect(hasThrown).to.be(true);
    }
  );
});
