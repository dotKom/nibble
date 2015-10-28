'use strict';

angular.module('nibble.shop', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shop', {
    templateUrl: 'views/shop/shop.html',
    controller: 'shopCtrl'
  });
}])

.controller('shopCtrl', function($scope, $rootScope, $location, $http) {
  $scope.user = $rootScope.user;

  if(!$scope.user){
    $location.url("/");
    Materialize.toast("You need to login first!", 4000);
  }else{

    var testItem = {"name":"Øl", "description":"0.5L Dahls på glassflaske", "price":"20", "amount":42, "available":true, "category":"drink"}
    var testItem2 = {"name":"Billys", "description":"Dypfryst pizza med ost og skinke", "price":"20", "amount":42, "available":true, "category":"mat"}
    
    $scope.items = [testItem, testItem2, testItem, testItem2, testItem, testItem2, testItem, testItem2]
  }
})
;

/*
=== Models ===

Product
    Name
    Price
    Description
    Amount
    Available (If the product should be displayed to the user)
    Product Category

Transaction
    User
    Money diff (minus for subtraction, plus for addition) (Optional)
    Product (Optional)
    Timestamp

http({
  method: "get",
  url: "https://www.online.ntnu.no/payme/products"
}).then(function(data){
  root.products = data;
});

*/
