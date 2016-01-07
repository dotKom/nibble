'use strict';

angular.module('nibble.shop', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shop', {
    templateUrl: 'views/shop/shop.html',
    controller: 'shopCtrl'
  });
}])

.controller('shopCtrl', function($scope, $rootScope, $location, $interval, $http) {
  /*Note: The controller runs tiwce for some reason*/
  if(!$rootScope.user){
    $rootScope.user = {name: "Ola Nordmann",balance: 720};
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
    for(var i=0; i< $scope.items.length;i++){
      $scope.items[i]["oId"] = "a" + $scope.items[i]["id"];
    }
  },function(error){
    Materialize.toast("Could not load shop inventory", 4000);
  });
  /*http://www.lunsj.no/14636-thickbox_default/knorr-tomatsuppe.jpg*/
  /*
    Set oId to "a" + id
    oId is used for referance in $rootScope.shopQueue
    regular id can't be used, it needs to contain
    alpha characters in order to display the queue
    correctly
  */
  var testItem = {oId:"a1",id:"1","name":"Øl", "description":"0.5L Dahls på glassflaske", "price":"20", "amount":42, "available":true, "category":"drikke", 
                  "image": "http://3.bp.blogspot.com/_eBUfxxSLsVw/TSoQTbARxiI/AAAAAAAAAEk/V927sCd8uRU/s1600/dahls.png","dispCount":0}
  var testItem2 = {oId:"a2", id:"2","name":"Billys", "description":"Dypfryst pizza med ost og skinke", "price":20, "amount":42, "available":true, 
                  "category":"mat", "image": "http://www.brynildsen.no/upload/Billys-original-NY.png","dispCount":0}
  var testItem3 = {oId:"a3", id:"3","name":"Rett i koppen", "description":"Mat...", "price":40, "amount":42, "available":true, 
                  "category":"mat", "image": "http://www.lunsj.no/14636-thickbox_default/knorr-tomatsuppe.jpg","dispCount":0}
  /**/
  var testItem4 = {oId:"a4", id:"4","name":"Solbærtoddy", "description":"Toddy", "price":25, "amount":42, "available":true, "category":"drikke", "image": "http://proddb.kraft-hosting.net/prod_db/proddbimg/11324.png","dispCount":0}
  
  var testItem5 = {oId:"a5", id:"5","name":"Kinder: bueno", "description":"Kinder", "price":10, "amount":42, "available":true, "category":"snacks", "image": "http://www.kinder.me/image/journal/article?img_id=7231869&t=1445520902223","dispCount":0}
  

  
  $scope.items = [testItem, testItem2, testItem3, testItem4, testItem5, testItem, testItem2, testItem3, testItem4];
  /*$scope.selectedItems = [testItem, testItem2];*/
  $rootScope.shopQueue = {};
 
/*  $scope.totalSum = getTotalSum();*/
  $scope.totalSum = 0;
  $rootScope.logoutTimer = 60;

  function getTotalSum(){
    var totalSum = 0; 
    angular.forEach($rootScope.shopQueue, function(element) {
      totalSum += element.count * element.item.price;
    });
    return totalSum;
  }
  
  $scope.changeCount = function(itemRef,count){
    if(($scope.totalSum+(itemRef.price*count)) <= $scope.user.balance){
      if(!$rootScope.shopQueue[itemRef.oId]){
        $rootScope.shopQueue[itemRef.oId] = {"item":itemRef,"count": 0};
      }
      $rootScope.shopQueue[itemRef.oId].count = Math.max(0,$rootScope.shopQueue[itemRef.oId].count+count);
      $rootScope.shopQueue[itemRef.oId].item.dispCount = $rootScope.shopQueue[itemRef.oId].count;
      if($rootScope.shopQueue[itemRef.oId].count <= 0){
        delete $rootScope.shopQueue[itemRef.oId];
        /*
          Force key 'reorder':
          Has to be done in order for a newly added
          item to appear on the bottom of the queue
        */
        var tmp = $rootScope.shopQueue;
        $rootScope.shopQueue = {};
        for(var k in tmp){
          $rootScope.shopQueue[k] = tmp[k];
        }
      }
    }else{
      console.log(($scope.totalSum+itemRef.price),$scope.user.balance);
      Materialize.toast("Totalprisen overstrider din saldo", 2000);
    }
    $scope.totalSum = getTotalSum();

    $rootScope.logoutTimer = 60;
  }

  $scope.checkout = function(){
    /*
      Insert validation code here  
    */
     $http({
      url: "/payme/buy",
      method: "post",
      data: {
        "user": $rootScope.rfid,
        "products": $rootScope.shopQueue
      }
     }).then(function(ret){
      $rootScope.shopQueue = {};
      Materialize.toast("Success: "+ret, 4000);
      //TODO: get new user balance and history
     },function(error){
       Materialize.toast("Could not checkout", 4000);
       Materialize.toast("Server returned error code: " + error.status, 4000); 
     
     });

     $('#checkoutModal').openModal();

     $rootScope.logoutTimer = 5;

  }

  $rootScope.newOrder = function(){
    $rootScope.shopQueue = {};
    $scope.totalSum = 0;
    $('#checkoutModal').closeModal();
    
    $rootScope.logoutTimer = 60;
    $interval.cancel($rootScope.interval);
    $scope.startInterval();
  }

  
  $scope.$on('$destroy', function(){
    $rootScope.newOrder();
    $interval.cancel($rootScope.interval);
  });

  $scope.startInterval = function(){
    $rootScope.interval = $interval(function(){
      $rootScope.logoutTimer -= 1;
      
      if($rootScope.logoutTimer <= 0){
        $interval.cancel($rootScope.interval);

        if(!$rootScope.development){
          $rootScope.logoutTimer = 0;
          $scope.logoutRedir();
        }
      }
    }, 1000);
  }

  $scope.startInterval();

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
    id
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
