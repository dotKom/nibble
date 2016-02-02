angular.module('nibble', [
  'ngRoute',
  'api.config',
  'ui.materialize',
  'nibble.login',
  'nibble.shop',
  'nibble.kvitering'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]).
controller('MainCtrl', ["$scope", function ($scope) {
  /*Not used
  $scope.select = {
        value1: "Option1",
        value2: "I'm an option",
        choices: ["Option1", "I'm an option", "This is materialize", "No, this is Patrick."]
    };

    $scope.dummyInputs = {};

    */

}]).run(["$rootScope", "$location", "$http","Transaction","api.config", function(root, location, http,Transaction,api){
  /*Definitions of root functions:*/
  window.aRoot = root;
  root.ceil = Math.ceil;
  root.development = false;
  root.cash_amounts = [50, 100, 200];
  root.add_money_amount = 0;
  root.custom_amount_disabled = false;
  root.withdraw_money_amount = 0;
  root.logoutTimer = 0;
  
  
  root.logout = function(){
    root.rfid = null;
    root.user = null;
    root.showBalModule = false;
    location.url("/");
  }

  root.selectAddAmount = function(amount){
    root.add_money_amount = amount;
    root.custom_amount_disabled = true;
  }

  root.selectWithdrawAmount = function(amount){
    root.withdraw_money_amount = amount;
    root.custom_amount_disabled = true;
  }

  root.enableCustomAmount = function(){
    root.custom_amount_disabled = false;
  }

  root.invalidAmount = function(amount){
    return !(amount && parseFloat(amount) &&  parseFloat(amount) > 0);
  }

  root.invalidWithdrawAmount = function(amount){
    if(amount<=root.user.balance && !root.invalidAmount(amount)){
        return false;
    }
    return true;
  }

  root.addMoney = function(amount){
    root.logoutTimer = 60;
    root.updateMoney(parseInt(amount));
  }

  root.withdrawMoney = function(amount){
    root.logoutTimer = 60;
    root.updateMoney(parseInt(-amount));
  }
  root.updateMoney = function(amount){
    /*
      Update backend
    */
    console.log(root.user.pk);
    http({
      url: api.apiRoot + "transactions/",
      method: "post",
      data: {
        "user": root.user.pk,
        "amount": amount
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"        
      },
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
    }).then(function(ret){
      root.user.balance += amount;
      if(amount > 0){
          Materialize.toast(amount + "kr er blitt lagt inn på kontoen din", 5000, "nibble-color success");
      }else{
          Materialize.toast((-amount) + "kr er blitt fjernet fra kontoen din", 5000, "nibble-color success"); 
      }
    },function(error){
      
    });
    root.logoutTimer = 60;
  }
  
}]);
$("body").click(function(){
  window.aRoot.interval = 60;
});
