'use strict';

angular.module('nibble.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/login/login.html',
    controller: 'loginCtrl'
  });
}])
.controller('loginCtrl', ["$rootScope","$http","$location","$scope","api.config","User",function(root,http,location,scope,api,User) {
  root.clearAll();
  //In root due to being accessed by a modal in index.html
  root.submit_reg = function($event){
    //Prevent form from refreshing page
    
    if(isValidRFID(root.rfid)){
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
        scope.submit_login();
        $('#regModal').closeModal();

      },function(error){
        console.log(error);
        Materialize.toast("Registrering feilet!",3000);
      });
    }
  }
  scope.submit_login = function($event){
    //Prevent form from refreshing page
    if($event && $event.preventDefault){
      $event.preventDefault();
    }
    /*Validation and 'login' code:*/
    $("#rfid-rlogo")[0].style.borderColor = "#65EC00";
    window.logKeys = false;
    root.rfid = window.rfid;
    root.validation_fail = false;
    if(isValidRFID(root.rfid)){
      http({
        url: api.apiRoot + "usersaldo/?format=json&rfid="+ root.rfid,
        method: "get"
      }).then(function(ret){
          if(ret.data.count == 1){
            $("#rfid-rlogo")[0].style.borderColor = "#65EC00";
            root.user = ret.data.results[0];
            root.user.balance = root.user.saldo;
            root.user.name = root.user.first_name + " " + root.user.last_name;
            location.url("/shop");
            window.rfid = "";
          }
          else{
            $("#rfid-rlogo")[0].style.borderColor = "#FF471E";
            root.validation_fail = true;
            $("#user-username").val("");
            $("#user-password").val("");
            Materialize.toast("Validering feilet!", 2000);
            Materialize.toast("Fyll inn brukernavn og passord", 2000);
            $('#regModal').openModal({
              "complete": function(){
                $("#rfid-rlogo")[0].style.borderColor = "";
                window.logKeys = true;
                window.rfid = null;
                $("#user-username").val("");
                $("#user-password").val("");
              }
            });
          }
        },
        function(error){
          console.log(error);
          root.clearAll();
          root.validation_fail = false;
          Materialize.toast("[Error] Server returned error code: " + error.status, 4000);
        }
      );
    }else{
      //Defined in app.js
      root.clearAll();
      Materialize.toast("[Error] Invalid RFID", 4000);
    }
  }
  /*
  Item list should be loaded in app to be used by both shop and login (?)
  */
  if(root.items){
    root.itemCols = [root.items.slice(0, Math.ceil(root.items.length/2)), root.items.slice(Math.ceil(root.items.length/2))]
  }
}]);
function isValidRFID(rfid){
  return typeof(rfid) === "string" && /^\d{8,10}$/.test(rfid);
}
$('body').keypress(function(key) {
  /*Logs keys when in login and not regestering*/
  if(window.logKeys){
    if(key.keyCode == 13){ // Enter
      $("#rfid-form").submit();
    }
    else{
      window.rfid += String.fromCharCode(key.keyCode);
    }
  }
});
  