'use strict';

angular.module('nibble.shop', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shop', {
    templateUrl: 'views/shop/shop.html',
    controller: 'shopCtrl'
  });
}])

.controller('shopCtrl', function($scope, $rootScope, $location, $http) {
  /*Note: The controller runs tiwce for some reason*/
  if(!$rootScope.user){
    $rootScope.user = {name: "testUser",balance: 200};
    /*$location.url("/");
    Materialize.toast("You need to login first!", 4000);
    return;*/
  }
  $http({
    url: "/api/v1/inventory/",
    method: "post",
    data: {}
  }).then(function(ret){
    $scope.items = ret.data.inventory;
  },function(error){
    Materialize.toast("Could not load shop inventory", 4000);
  });
  
  var testItem = {id:"a1","name":"Øl", "description":"0.5L Dahls på glassflaske", "price":"20", "amount":42, "available":true, "category":"drink", 
                  "image": "http://3.bp.blogspot.com/_eBUfxxSLsVw/TSoQTbARxiI/AAAAAAAAAEk/V927sCd8uRU/s1600/dahls.png","dispCount":0}
  var testItem2 = {id:"a2","name":"Billys", "description":"Dypfryst pizza med ost og skinke", "price":"20", "amount":42, "available":true, 
                  "category":"mat", "image": "http://www.brynildsen.no/upload/Billys-original-NY.png","dispCount":0}
  
  

  $scope.items = [testItem, testItem2, testItem, testItem2, testItem, testItem2, testItem, testItem2];
  /*$scope.selectedItems = [testItem, testItem2];*/
  $scope.shopQueue = {};
 
/*  $scope.totalSum = getTotalSum();*/
  $scope.totalSum = 0;
  function getTotalSum(){
    var totalSum = 0; 
    angular.forEach($scope.shopQueue, function(element) {
      totalSum += element.count * element.item.price;
    });
    return totalSum;
  }
  
  $scope.changeCount = function(itemRef,count){
    if(!$scope.shopQueue[itemRef.id]){
      $scope.shopQueue[itemRef.id] = {"item":itemRef,"count": 0};
    }
    $scope.shopQueue[itemRef.id].count = Math.max(0,$scope.shopQueue[itemRef.id].count+count);
    $scope.shopQueue[itemRef.id].item.dispCount = $scope.shopQueue[itemRef.id].count;
    if($scope.shopQueue[itemRef.id].count <= 0){
      
      console.log($scope.shopQueue);
      delete $scope.shopQueue[itemRef.id];
      /*Force key reorder:*/
      var tmp = $scope.shopQueue;
      $scope.shopQueue = {};
      for(var k in tmp){
        $scope.shopQueue[k] = tmp[k];
      }
    }
    $scope.totalSum = getTotalSum();
  }
  $scope.checkout = function(){
    /*
      Insert validation code here  
    */
     http({
      url: "/payme/buy",
      method: "post",
      data: {
        "user": $rootScope.rfid,
        "products": $scope.shopQueue
      }
     }).then(function(ret){
       $scope.shopQueue = {};
       /*Prompt user to 'logout' or 'continue shopping'*/
     },function(error){
       Materialize.toast("Could not checkout", 4000);
       Materialize.toast("Server returned error code: " + error.status, 4000);
        
     });
  }
  
  
  /*function add(item){
    try:
    order[item.unique].amount += 1;
    else:
      order[item.unique] = {amount:1, item:item}

  }*/
});

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
