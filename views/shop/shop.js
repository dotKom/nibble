'use strict';

angular.module('nibble.shop', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shop', {
    templateUrl: 'views/shop/shop.html',
    controller: 'shopCtrl'
  });
}])

.controller('shopCtrl', function($scope) {
    var testItem = {"name":"Øl", "description":"0.5L Dahls på glassflaske", "price":"20", "amount":42, "available":true, "category":"drink"}
    var testItem2 = {"name":"Billys", "description":"Dypfryst pizza med ost og skinke", "price":"20", "amount":42, "available":true, "category":"mat"}
    
    $scope.items = [testItem, testItem2]
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

*/