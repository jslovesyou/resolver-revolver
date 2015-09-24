'use strict';

var completion = require('../../lib/completion');
var expect = require('expect.js');

describe('completion.froms', function () {

  it('should contain .froms', function () {
    expect(completion.froms)
      .to.be.a('function');
  });

  it('should return an empty array when called with no arguments', function () {
    var arrayArgument = [];
    var results = completion.froms();
    expect(results)
      .to.be.an('array');
    expect(results.length).to.be(arrayArgument.length);
  });

  it('should throw with non array argument', function () {
    var throwable;
    var stringArgument = 'stringArgument';
    try {
      completion.froms(stringArgument);
    } catch (e) {
      throwable = e;
    }
    expect(throwable).to.be.an('object');
    expect(throwable.name).to.be.a('string');
    expect(throwable.name).to.be('Error');
    expect(throwable.message).to.be.a('string');
    expect(throwable.message).to.be('Argument is not an array');
    expect(throwable.arguments).to.be.an('array');
    expect(throwable.arguments.length).to.be(1);
    expect(throwable.arguments[0]).to.be.a('string');
    expect(throwable.arguments[0]).to.be(stringArgument);
  });

  it('should return an array when called with empty array argument',
    function () {
      var arrayArgument = [];
      var result = completion.froms(arrayArgument);
      expect(result)
        .to.be.an('array');
    }
  );

  it('should return an array with objects when called with array of strings',
    function () {
      var arrayArgument = ['1', '2'];
      var results = completion.froms(arrayArgument);
      expect(results)
        .to.be.an('array');
      results.map(function (result) {
        expect(result).to.be.an('object');
      });
    });


  it('should return an array of same length as length of array with which it ' +
    'is called',
    function () {
      var arrayArgument = ['1', '2', '3', '4'];
      var results = completion.froms(arrayArgument);
      expect(results)
        .to.be.an('array');
      expect(results.length).to.be(arrayArgument.length);
    }
  );

  it('should return each returning item as an object when given an array of ' +
    'non-objects',
    function () {
      var arrayArgument = ['1', '2', '3', '4'];
      var results = completion.froms(arrayArgument);
      expect(results)
        .to.be.an('array');
      results.map(function (result, index) {
        expect(result).to.be.an('object');
        expect(result.target).to.be.a('string');
        expect(result.target).to.be(arrayArgument[index]);
      });
    }
  );

  it('should return each returning item as an object when given an array of ' +
    'objects where ',
    function () {
      var target1 = {
        target: '1'
      };
      var target2 = {
        target: '2'
      };
      var arrayArgument = [target1, target2];
      var results = completion.froms(arrayArgument);
      expect(results)
        .to.be.an('array');
      results.map(function (result, index) {
        expect(result).to.be.an('object');
        expect(result.target).to.be.a('string');
        expect(result).to.be(arrayArgument[index]);

      });
    }
  );
  it('should throw when argument array item is an object with .target as ' +
    'string',
    function () {
      var target1 = {
        target: 123
      };

      var arrayArgument = [target1];
      try {
        completion.froms(arrayArgument);
      } catch (e) {
        expect(e).to.be.an('object');
        expect(e.name).to.be.a('string');
        expect(e.name).to.be('Error');
        expect(e.message).to.be.a('string');
        expect(e.message).to.be('from.target is not a string');
        expect(e.arguments).to.be.an('array');
        expect(e.arguments.length).to.be(1);
        expect(e.arguments[0]).to.be.an('array');
        expect(e.arguments[0][0]).to.be.an('object');
        expect(e.arguments[0][0]).to.be(target1);
      }
    }
  );
});
