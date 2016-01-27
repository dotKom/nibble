'use strict';

angular.module('nibble.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/login/login.html',
    controller: 'loginCtrl'
  });
}])
.controller('loginCtrl', ["$rootScope","$http","$location","$scope","api.config",function(root,http,location,scope,api) {
  

  
//  $("#rfid-input").focus();
  /*$("#rfid-input").focus(function(e){
    console.log("Test");
  });
  $("#rfid-input").blur(function(e){
    console.log("Test");
  });*/
  scope.rfid = "";
  
  scope.submit_reg = function(){
    console.log(root.validation_fail);
    console.log(root.rfid);
    console.log(root);
  
    http({
      url: "http://78.91.16.140:8001/api/v1/rfid/",
      method: "POST",
      data: {
        username: $("#user-username").val(),
        password: $("#user-password").val(),
        rfid: root.rfid
      }
    }).then(function(ret){
      /*Success*/
      if(ret.data){
        root.user = ret.data;
      }else{
        
      }
    },function(error){
      /*Fail*/
      
    });
  }
  scope.submit_login = function(){
      /*Validation and 'login' code:*/
      
      root.rfid = $("#rfid-input").val();
      console.log(root.rfid,root);
      root.validation_fail = false;
      //Check if a user is assosiated with the rfid
      //$http request:
      http({
        url: "http://78.91.16.140:8001/api/v1/usersaldo/?format=json&rfid="+ $("#rfid-input").val(),
      //  data: {rfid: root.rfid}
        method: "get"
      }).then(function(ret){
          /*Success*/
          console.log("Logging in!");
          console.log(ret);
          if(ret.data.count > 0){
            root.user = ret.data.results[0]; //<-- if data is json??
            root.user.balance = root.user.saldo;
            root.user.name = root.user.first_name + " " + root.user.last_name;
              location.url("/shop");
          }
          else{
            $("#rfid-input").val("");
            root.validation_fail = true;
            $('#regModal').openModal();
            Materialize.toast("Validation failed!", 2000);
            Materialize.toast("Fill inn username and password", 2000);
          }
        },
        function(error){
          /*Fail*/
          /*Only called when an error respons occurs*/
          $('#regModal').openModal();
          root.rfid = null;
          root.user = null;
          root.validation_fail = false;
          console.log(error);
          Materialize.toast("[Error] Server returned error code: " + error.status, 4000);
          /*Display error in card?*/

          /*Temp test code: */
          /*if(root.development){  
            location.url("/shop");
          }*/
        }

      );
    };



  /*
  Item list should be loaded in app to be used by both shop and login (?)
  */
  //root.items
  
  //root.itemCols = [root.items.slice(0, Math.ceil(root.items.length/2)), root.items.slice(Math.ceil(root.items.length/2))]

}]);