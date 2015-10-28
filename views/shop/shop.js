'use strict';

angular.module('nibble.shop', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shop', {
    templateUrl: 'views/shop/shop.html',
    controller: 'shopCtrl'
  });
}])

.controller('shopCtrl', ["$rootScope","$location","$http",function(root,location,http) {
  if(!root.user){
    location.url("/");
    Materialize.toast("You need to login first :/", 4000);
  }else{
    root.products = [
      {name: "Dahls", desc: "33cl dahls",cost: 20,img: ""}
    ];
    /*http({
      method: "get",
      url: "https://www.online.ntnu.no/payme/products"
    }).then(function(data){
      root.products = data;
    });*/  
  }
  
}]);