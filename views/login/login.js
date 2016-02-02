'use strict';

angular.module('nibble.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/login/login.html',
    controller: 'loginCtrl'
  });
}])
.controller('loginCtrl', ["$rootScope","$http","$location","$scope","api.config","User",function(root,http,location,scope,api,User) {

window.rfid = ""
 

 scope.regModal = false;
  scope.rfid = "";
  root.submit_reg = function(){
    http({
      url: api.apiRoot + "rfid/",
      method: "POST",
      data: {
        username: $("#user-username").val(),
        password: $("#user-password").val(),
        rfid: root.rfid
      }
    }).then(function(ret){
      /*Success*/
      $('#regModal').closeModal();
      scope.submit_login();
      
    },function(error){
      console.log(error);
      Materialize.toast("Registrering feilet!",3000);
    });
  }
  scope.submit_login = function(){
      /*Validation and 'login' code:*/
    root.rfid = window.rfid;
    window.rfid = "";
	console.log("rdif cleared: " + window.rfid);
    root.validation_fail = false;
      http({
        url: api.apiRoot + "usersaldo/?format=json&rfid="+ root.rfid,
        method: "get"
      }).then(function(ret){
          if(ret.data.count == 1){
            root.user = ret.data.results[0]; //<-- if data is json??
            root.user.balance = root.user.saldo;
            root.user.name = root.user.first_name + " " + root.user.last_name;
            location.url("/shop");
            console.log(root.user);
  		console.log(ret.data);
          }
          else{
            //$("#rfid-input").val("");
            root.validation_fail = true;
            root.username = "";
            $("#user-username").val("");
            $("#user-password").val("");
            scope.regModal = true;
            $('#regModal').openModal({
              complete: function(){
                $("#user-username").val("");
                $("#user-password").val("");
                scope.regModal = false;
              }
            });
            Materialize.toast("Validation failed!", 2000);
            Materialize.toast("Fill inn username and password", 2000);
          }
        },
        function(error){
          console.log(error);
          if(error.status == 401){
            setTimeout(scope.submit_login,500);
          }else{
            root.rfid = null;
            root.user = null;
            root.validation_fail = false;
            Materialize.toast("[Error] Server returned error code: " + error.status, 4000);
          }
        }

      );
    };
    
  /*
  Item list should be loaded in app to be used by both shop and login (?)
  */
  //root.items
  if(root.items){
    root.itemCols = [root.items.slice(0, Math.ceil(root.items.length/2)), root.items.slice(Math.ceil(root.items.length/2))]
  }
}]);


$('body').keypress(function(key) {
  if(key.keyCode == 13){ // Enter
          console.log(window.rfid);
          $("#rfid-form").submit();
  }
  else{
    window.rfid += String.fromCharCode(key.keyCode);
  }
});
  
