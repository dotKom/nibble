'use strict';

describe('nibble.shop module', function() {

  beforeEach(module('nibble.shop'));

  describe('shop controller', function(){

    it('should ....', inject(function($rootScope,$controller) {
      var shopCtrl = $controller('shopCtrl');
      expect(shopCtrl).toBeDefined();
      expect($rootScope.user).toBeDefined();
    }));
  });
}); 