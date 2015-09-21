'use strict';

var resolverRevolver = require('../index');
var expect = require('expect.js');

describe('resolverRevolver', function () {
  it('should be a object', function () {
    expect(resolverRevolver)
      .to.be.an('object');
  });
  it('should contain .parse', function () {
    expect(resolverRevolver.parse)
      .to.be.a('function');
  });
});
