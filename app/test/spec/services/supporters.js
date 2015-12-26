'use strict';

describe('Service: supporters', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var supporters;
  beforeEach(inject(function (_supporters_) {
    supporters = _supporters_;
  }));

  it('should do something', function () {
    expect(!!supporters).toBe(true);
  });

});
