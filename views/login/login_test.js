'use strict';

describe('nibble.login module', function() {

  beforeEach(module('nibble.login'));

  describe('login controller', function(){

    it('should ....', inject(function($rootScope,$controller) {
      var loginCtrl = $controller('loginCtrl');
      expect(loginCtrl).toBeDefined();
      expect($rootScope.user).not.toBeDefined();
    }));

  });
});