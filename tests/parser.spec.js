'use strict';

var parser = require('../lib/parser');
var expect = require('expect.js');

describe('parser', function () {
  it('should be an object', function () {
    expect(parser)
      .to.be.an('object');
  });

  it('should be contain function .parse', function () {
    expect(parser.parse)
      .to.be.a('function');
  });
});
