'use strict';

var completion = require('../lib/completion');
var expect = require('expect.js');

describe('completion', function () {
  it('should be a object', function () {
    expect(completion)
      .to.be.an('object');
  });

  it('should contain .preconditions', function () {
    expect(completion.preconditions)
      .to.be.a('function');
  });

  it('should contain .froms', function () {
    expect(completion.froms)
      .to.be.a('function');
  });
});
