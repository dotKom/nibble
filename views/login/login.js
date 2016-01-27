'use strict';

angular.module('nibble.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/login/login.html',
    controller: 'loginCtrl'
  });
}])
.controller('loginCtrl', ["$rootScope","$http","$location",function(root,http,location) {
  

  
//  $("#rfid-input").focus();
  console.log(document.getElementById("rfid-input"));
  /*$("#rfid-input").focus(function(e){
    console.log("Test");
  });
  $("#rfid-input").blur(function(e){
    console.log("Test");
  });*/
  $("#reg-form").submit(function(e){
    e.preventDefault();
    http({
      url: "<reg>",
      method: "POST",
      data: {rfid: root.rfid}
    }).then(function(ret){
      /*Success*/
      if(ret.data){
        root.user = ret.data;
      }else{
        
      }
    },function(error){
      /*Fail*/
      
    });
    /*Registration code:*/
  });

  /*
  Item list should be loaded in app to be used by both shop and login (?)
  */
  //root.items
  
  //root.itemCol1 = root.items.slice(0, Math.ceil(root.items.length/2));
  //root.itemCol2 = root.items.slice(Math.ceil(root.items.length/2));

  $("#rfid-form").submit(function(e){
    /*Validation and 'login' code:*/
    e.preventDefault();
    root.rfid = $("#rfid-input").value;
    console.log(root.rfid);
    root.validation_fail = false;
    //Check if a user is assosiated with the rfid
    //$http request:
    http({
      url: "<login>",
      method: "post",
      data: {rfid: root.rfid}
    }).then(function(ret){
        /*Success*/
        if(ret.data){
          root.user = ret.data; //<-- if data is json??
          location.url("/shop");
        }
        else{
          root.rfid = null;
          root.validation_fail = true;
          Materialize.toast("Validation failed!", 2000);
          Materialize.toast("Fill inn username and password", 2000);
        }
      },
      function(error){
        /*Fail*/
        /*Only called when an error respons occurs*/
        root.rfid = null;
        root.user = null;
        root.validation_fail = false;
        console.log(error);
        Materialize.toast("[Error] Server returned error code: " + error.status, 4000);
        /*Display error in card?*/
      
        /*Temp test code: */
        if(root.development){  
          location.url("/shop");
        }
      }

    );
  });
}]);