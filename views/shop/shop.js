'use strict';

angular.module('nibble.shop', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shop', {
    templateUrl: 'views/shop/shop.html',
    controller: 'shopCtrl'
  });
}])

.controller('shopCtrl', ['$scope', '$rootScope', '$location', '$interval', '$http', 'Inventory','Transaction', 'api.config', function($scope, $rootScope, $location, $interval, $http, Inventory, api) {
  /*Note: The controller runs tiwce for some reason*/
  if(!$rootScope.user){
    if(!$rootScope.development){
      $location.url("/");
      Materialize.toast("Logg inn først!", 4000);
      return;
    }else{
      $rootScope.user = {name: "Ola Nordmann",balance: 720};
      Materialize.toast("(devmode) Using local test user", 1000);
    }
  }
  /*Download the shops inventory*/
  
  Inventory.get(
    function(ret){
      //console.log(ret)
      $scope.items = ret.results;
      for(var i=0; i< $scope.items.length;i++){
        if($scope.items[i].image)
          $scope.items[i]["disp_image"] = api.host + $scope.items[i].image.thumb;
        $scope.items[i]["oId"] = "a" + $scope.items[i]["pk"];
      }
      console.log($scope.items)
    },
    function(error){
      Materialize.toast("[ERROR] Could not load shop inventory", 4000);
    }
  );

  /*
    Set oId to "a" + id
    oId is used for referance in $rootScope.shopQueue
    regular id can't be used, it needs to contain
    alpha characters in order to display the queue
    correctly
  */
  /*
  var testItem = {oId:"1",id:"1","name":"Øl", "description":"0.5L Dahls på glassflaske", "price":"20", "amount":42, "available":true, "category":"drikke", 
                  "image": "http://3.bp.blogspot.com/_eBUfxxSLsVw/TSoQTbARxiI/AAAAAAAAAEk/V927sCd8uRU/s1600/dahls.png","dispCount":0};
  var testItem2 = {oId:"2", id:"2","name":"Billys", "description":"Dypfryst pizza med ost og skinke", "price":20, "amount":42, "available":true, 
                  "category":"mat", "image": "http://www.brynildsen.no/upload/Billys-original-NY.png","dispCount":0};
  var testItem3 = {oId:"3", id:"3","name":"Rett i koppen", "description":"Mat...", "price":40, "amount":42, "available":true, 
                  "category":"mat", "image": "http://www.lunsj.no/14636-thickbox_default/knorr-tomatsuppe.jpg","dispCount":0};
  /**/
  /*
  var testItem4 = {oId:"4", id:"4","name":"Solbærtoddy", "description":"Toddy", "price":25, "amount":42, "available":true, "category":"drikke", "image": "http://proddb.kraft-hosting.net/prod_db/proddbimg/11324.png","dispCount":0};
  
  var testItem5 = {oId:"5", id:"5","name":"Kinder: bueno", "description":"Kinder", "price":10, "amount":42, "available":true, "category":"snacks", "image": "http://www.kinder.me/image/journal/article?img_id=7231869&t=1445520902223","dispCount":0};
  */
  
  $rootScope.items = [testItem, testItem2, testItem3, testItem4, testItem5, testItem, testItem2, testItem3, testItem4];
  $rootScope.shopQueue = {};

  var historyItem_1 = {
    "name":"Øl",
    "id":"1",
    "amount":10
  }
  var historyItem_2 = {
    "name":"Kinder: bueno",
    "id":"5",
    "amount":10
  }
  $scope.user.history = [
    historyItem_1,historyItem_2,historyItem_1,historyItem_1
  ];
  $scope.totalSum = 0;
  $rootScope.logoutTimer = 60;
  $scope.isCheckingOut = false;


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

    $('#checkoutModal').openModal({
      complete : $rootScope.newOrder
    });

    $http({
      url: "/payme/buy",
      method: "post",
      data: {
        "user": $rootScope.rfid,
        "products": $rootScope.shopQueue
      }
    }).then(function(ret){
      $scope.successCheckout(ret);
    },function(error){
      if(!$rootScope.development){
        $scope.errorCheckout(error);
      }else{
        Materialize.toast("(devmode) Checkout actually failed, status: "+error.status, 3000);
        $scope.successCheckout(error);
      }
    });
    
    $rootScope.logoutTimer = 5;
    $scope.isCheckingOut = true;

  }


  //Reset all temporary/user-related changes here
  $rootScope.newOrder = function(){
    $rootScope.shopQueue = {};
    $scope.totalSum = 0;
    $scope.isCheckingOut = false;
    $('#checkoutModal').closeModal();
    
    $rootScope.logoutTimer = 60;
    //$interval.cancel($rootScope.interval);
    $scope.startInterval();
    $(".check").attr("class", "check");
    $(".fill").attr("class", "fill");
    $(".path").attr("class", "path");

    $("#order-status").text("Handel fullført!");
    $("#order-status").removeClass("red-text");

    $(".path").attr("stroke", "#7DB0D5");
    $(".fill").attr("stroke", "#7DB0D5");
  }

  
  $scope.$on('$destroy', function(){
    if(angular.isDefined($rootScope.interval)){
      $interval.cancel($rootScope.interval);
    }
    $rootScope.newOrder();
  });
  $scope.startInterval = function(){
    if(angular.isDefined($rootScope.interval)){
      $interval.cancel($rootScope.interval);
    }
    $rootScope.time = new Date();
    $rootScope.dTime = new Date();
    $rootScope.timeAcc = 0;
    $rootScope.interval = $interval(function(){
      $rootScope.dTime = new Date() - $rootScope.time;
      $rootScope.time = new Date();
      $rootScope.timeAcc += $rootScope.dTime;
      $rootScope.logoutTimer -= $rootScope.dTime/1000;
      if($rootScope.logoutTimer <= 0){
        $interval.cancel($rootScope.interval);
          
        if(!$rootScope.development){
          $rootScope.logoutTimer = 0;
          $scope.logoutRedir();
        }else{
          Materialize.toast("(devmode) Automated logout disabled", 1000);
        }
      }
      else if($rootScope.logoutTimer <= 5 && $rootScope.timeAcc >= 1000 && $scope.isCheckingOut == false){
        $rootScope.timeAcc = 0;
        Materialize.toast("Automatisk utlogging om: " + Math.ceil($rootScope.logoutTimer), 900, "red");
      }
    }, 50);

  }

  $scope.successCheckout = function(ret){
    //TODO: get new user balance and history

    $(".check").attr("class", "check check-complete");
    $(".fill").attr("class", "fill fill-complete");
    setTimeout(function () {
        $(".check").attr("class", "check check-complete success");
        $(".fill").attr("class", "fill fill-complete success");
        $(".path").attr("class", "path path-complete");
    }, 1000);
  }

  $scope.errorCheckout = function(error){
    Materialize.toast("Server returned error code: " + error.status, 8000); 
    $("#order-status").text("Handel feilet!");
    $("#order-status").addClass("red-text");
    $(".path").attr("stroke", "#F44336");
    $(".fill").attr("stroke", "#F44336");
  }

  $scope.startInterval();

  /*function add(item){
    try:
    order[item.unique].amount += 1;
    else:
      order[item.unique] = {amount:1, item:item}

  }*/
}]);

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
