'use strict';

var builder = require('../lib/builder');
var expect = require('expect.js');

describe('builder', function () {
  it('should be a function', function () {
    expect(builder)
      .to.be.a('function');
  });



  it('should throw when pattern argument is not defined', function () {
    var hasThrown = false;
    try {
      builder();
    } catch (e) {
      hasThrown = true;
      expect(e).to.be.an('object');
      expect(e.name).to.be.a('string');
      expect(e.name).to.be('Error');
      expect(e.message).to.be.a('string');
      expect(e.message).to.be('Expected pattern to be defined');
      expect(e.arguments).to.be.an('array');
      expect(e.arguments.length).to.be(0);
    }

    expect(hasThrown).to.be(true);
  });

  it('should throw when pattern argument is not a string or a ' +
    'number',
    function () {
      var hasThrown = false;
      var objectArgument = {};
      try {
        builder(objectArgument);
      } catch (e) {
        hasThrown = true;
        expect(e).to.be.an('object');
        expect(e.name).to.be.a('string');
        expect(e.name).to.be('Error');
        expect(e.message).to.be.a('string');
        expect(e.message).to.be('Expected pattern to be a number or a ' +
          'string, but got something else');
        expect(e.arguments).to.be.an('array');
        expect(e.arguments.length).to.be(1);
        expect(e.arguments[0]).to.be.an('object');
        expect(e.arguments[0]).to.be(objectArgument);
      }

      expect(hasThrown).to.be(true);
    });

  it('should return a function', function () {
    var fn = builder('foo.bar');
    expect(fn).to.be.a('function');
  });

  it('should return a function which returns an object', function () {
    var fn = builder('foo.bar');
    expect(fn).to.be.a('function');
    var tree = fn(123);
    expect(tree).to.be.an('object');
  });

  it('should return a function which sets its argument to the deepest level ' +
    'in the tree',
    function () {
      var deep = {};
      var fn = builder('foo.bar');
      expect(fn).to.be.a('function');
      var tree = fn(deep);
      expect(tree).to.be.an('object');
      expect(tree.foo.bar).to.be.an('object');
      expect(tree.foo.bar).to.be(deep);
    });

  it('should return a function which sets its argument to the deepest level ' +
    'in the tree',
    function () {
      var deep = {};
      var fn = builder('foo.bar');
      expect(fn).to.be.a('function');
      var tree = fn(deep);
      expect(tree).to.be.an('object');
      expect(tree.foo.bar).to.be.an('object');
      expect(tree.foo.bar).to.be(deep);
    });

  it('should return a function which sets its argument to the deepest level ' +
    'in the tree',
    function () {
      var deep = {};
      var fn = builder(1234);
      expect(fn).to.be.a('function');
      var tree = fn(deep);
      expect(tree).to.be.an('object');
      expect(tree[1234]).to.be.an('object');
      expect(tree[1234]).to.be(deep);
    });
});
