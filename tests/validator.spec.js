'use strict';

var validator = require('../lib/validator');
var expect = require('expect.js');

describe('validator', function () {
  it('should be a function', function () {
    expect(validator)
      .to.be.a('function');
  });



  it('should throw when validatorSetup argument is not defined', function () {
    var hasThrown = false;
    try {
      validator();
    } catch (e) {
      hasThrown = true;
      expect(e).to.be.an('object');
      expect(e.name).to.be.a('string');
      expect(e.name).to.be('Error');
      expect(e.message).to.be.a('string');
      expect(e.message).to.be('Expected validatorSetup to be defined');
      expect(e.arguments).to.be.an('array');
      expect(e.arguments.length).to.be(0);
    }

    expect(hasThrown).to.be(true);
  });

  it('should throw when validatorSetup argument is not an object',
    function () {
      var hasThrown = false;
      var stringArgument = 'stringArgument';
      try {
        validator({}, stringArgument);
      } catch (e) {
        hasThrown = true;
        expect(e).to.be.an('object');
        expect(e.name).to.be.a('string');
        expect(e.name).to.be('Error');
        expect(e.message).to.be.a('string');
        expect(e.message).to.be('Expected validatorSetup to be an object, ' +
          'but got something else');
        expect(e.arguments).to.be.an('array');
        expect(e.arguments.length).to.be(2);
        expect(e.arguments[1]).to.be.an('string');
        expect(e.arguments[1]).to.be(stringArgument);
      }

      expect(hasThrown).to.be(true);
    });


});
