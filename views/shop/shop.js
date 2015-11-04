'use strict';

angular.module('nibble.shop', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shop', {
    templateUrl: 'views/shop/shop.html',
    controller: 'shopCtrl'
  });
}])

.controller('shopCtrl', function($scope, $rootScope, $location, $http) {

  if(!$scope.user){
    $rootScope.user = {name: "testUser",balance: 200};
    /*$location.url("/");
    Materialize.toast("You need to login first!", 4000);
    return;*/
  }

  var testItem = {"name":"Øl", "description":"0.5L Dahls på glassflaske", "price":"20", "amount":42, "available":true, "category":"drink", "image": "http://3.bp.blogspot.com/_eBUfxxSLsVw/TSoQTbARxiI/AAAAAAAAAEk/V927sCd8uRU/s1600/dahls.png"};
  var testItem2 = {"name":"Billys", "description":"Dypfryst pizza med ost og skinke", "price":"20", "amount":42, "available":true, "category":"mat", "image": "http://www.brynildsen.no/upload/Billys-original-NY.png"};
  var testItem3 = {"name":"Billys", "description":"Dypfryst pizza med ost og skinke", "price":"20", "amount":42, "available":true, "category":"mat", "image": "http://www.brynildsen.no/upload/Billys-original-NY.png"};
  
  $scope.items = [testItem, testItem2, testItem, testItem2, testItem, testItem2, testItem, testItem2];
  $scope.selectedItems = [testItem, testItem2, testItem3];

  $scope.totalSum = getTotalSum();

  function getTotalSum(){
    var totalSum = 0; 
    angular.forEach($scope.selectedItems, function(item) {
      totalSum += item.amount * item.price;
    });
    return totalSum;
  }
  /*function add(item){
    try:
    order[item.unique].amount += 1;
    else:
      order[item.unique] = {amount:1, item:item}

  }*/
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
