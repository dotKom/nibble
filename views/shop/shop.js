'use strict';

angular.module('nibble.shop', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shop', {
    templateUrl: 'views/shop/shop.html',
    controller: 'shopCtrl'
  });
}])
.directive('tabify',['$timeout',function($timeout){
  return {
    link: function($scope,element,attrs){
      $scope.$on("invloaded",function(){
        $timeout(function(){
          $(document).ready(function(){
            $('ul.tabs').tabs();
          });
        },0,false);
      })
    }
  }
}])
.controller('shopCtrl', ['$scope', '$rootScope', '$location', '$interval', '$http','$filter','$timeout', 'Inventory','Transaction', 'api.config', function($scope, $rootScope, $location, $interval, $http,$filter,$timeout, Inventory,Transaction, api) {
  /*Resetting rfid just in case*/
  
  window.rfid = "";
  window.logKeys = false;
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
  $rootScope.items = [];
  /**/
  /*$rootScope.itemKatMap = {"kat_all":{"title":"Alt","disabled":false,"pk":-1},"foods":{"title":"MAT OG DRIKKE","disabled":false,"pk":-2}}
  */
  $rootScope.itemKats = [];
  Array.prototype.getKatUnique = function(){
    var katMap = {};
    var ret = [];
    
    for(var i = 0; i<this.length;i++){
      if(!katMap[this[i].pk]){
        katMap[this[i].pk] = true;
        ret.push(this[i]);
      }
    }
    return ret;
  }
  Inventory.get(
    function(ret){
      $rootScope.items = ret;//$rootScope.items.concat(ret.results);
      var tempKats = [{"title":"Alt","disabled":false,"pk":-1}];
      for(var i=0; i< $scope.items.length;i++){
        if($rootScope.items[i].image)
        $rootScope.items[i]["disp_image"] = api.host + $rootScope.items[i].image.thumb;
        $rootScope.items[i]["oId"] = "a" + $rootScope.items[i]["pk"];
        $rootScope.items[i]["kat"] = ["kat_all"];
        if($rootScope.items[i]["category"]){
          var katName = $rootScope.items[i]["category"].name;
          var katPk = "kat_" + $rootScope.items[i]["category"].pk;
          $rootScope.items[i]["kat"].push(katPk);
          tempKats.push({"pk":parseInt(katPk),"title":katName,"disabled":false});
          //$rootScope.itemKatMap.push({"pk":parseInt(katPk),"title":katName,"disabled":false});
        }
      }
      $rootScope.itemKats = tempKats.getKatUnique();
      $timeout(function(){
        $scope.$broadcast("invloaded");
      },10,false);
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
      totalSum += element.quantity * element.item.price;
    });
    return totalSum;
  }
  
  $scope.changeCount = function(itemRef,quantity){
    console.log(itemRef);
    if(($scope.totalSum+(itemRef.price*quantity)) <= $scope.user.balance){
      if(!$rootScope.shopQueue[itemRef.oId]){
        $rootScope.shopQueue[itemRef.oId] = {"item":itemRef,"quantity": 0};
      }
      $rootScope.shopQueue[itemRef.oId].quantity = Math.max(0,$rootScope.shopQueue[itemRef.oId].quantity+quantity);
      $rootScope.shopQueue[itemRef.oId].item.dispQuantity = $rootScope.shopQueue[itemRef.oId].quantity;
      if($rootScope.shopQueue[itemRef.oId].quantity <= 0){
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
    console.log("Checkout!");
    $('#checkoutModal').openModal({
      complete : $rootScope.newOrder
    });
    var orders = [];
    for (let key in $rootScope.shopQueue){
      let elm = $rootScope.shopQueue[key]
      console.log(elm.item["pk"],elm.quantity);
      orders.push({quantity:elm.quantity,object_id:elm.item["pk"]});
    };
    $http({
      url: api.apiRoot + "orderline/",
      method: "post",
      data: {
        "user": $rootScope.user.pk,
        "orders": orders
      }
    }).then(function(ret){
      $scope.successCheckout(ret);
    },function(error){
      $scope.errorCheckout(error);
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
          $('#addCashModal').closeModal();
          $('#withdrawCashModal').closeModal();
          $rootScope.logout();
        }else{
          Materialize.toast("(devmode) Automated logout disabled", 1000);
        }
      }
      else if($rootScope.logoutTimer <= 5 && $rootScope.timeAcc >= 1000 && !$scope.isCheckingOut){
        $rootScope.timeAcc = 0;
        Materialize.toast("Automatisk utlogging om: " + Math.ceil($rootScope.logoutTimer), 900, "red");
      }
    }, 50);

  }
  
 /* $scope.$evalAsync(function(){
    $(document).ready(function(){
      $('ul.tabs').tabs();
    });
  });*/
  

  $scope.successCheckout = function(ret){
    //TODO: get new user balance and history
    $rootScope.user.balance -= $scope.totalSum;
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

*/
