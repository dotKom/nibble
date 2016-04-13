angular.module('nibble', [
  'ngRoute',
  'api.config',
  'ui.materialize',
  'nibble.login',
  'nibble.shop',
  'nibble.tabs'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]).
controller('MainCtrl', ["$scope", function ($scope) {
  /*Not used*/
}]).run(["$rootScope", "$location", "$http","$route","Transaction","api.config", function(root, location,http,route,Transaction,api){
  /*Root values:*/
  http({
    url: "./config.json",
    responseType: "json"
  }).then(function(ret){
    if(ret.data){
      root.development = ret.data.devmode || root.development;
      root.cash_amounts = ret.data.cashList || root.cash_amounts;
      if(root.development){
        //exposes root for easy console access
        window.aRoot = root;
      }
    }else{
      console.log("Could not load config!");
    }
  },function(error){
    console.log("Could not load config!");
  });
  
  root.reloadPage = function(){
    window.location.href = "";
  }
  root.ceil = Math.ceil;
  root.development = false;
  root.cash_amounts = [50, 100, 200];
  root.add_money_amount = 0;
  root.custom_amount_disabled = false;
  root.withdraw_money_amount = 0;
  root.logoutTimer = 0;
  root.numpadKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "del"];
  
  root.clearAll = function(){
    root.user = null;
    root.rfid = null;
    window.rfid = "";
    window.logKeys = true;
    $("#rfid-rlogo")[0].style.borderColor = "";
    $("#user-username").val("");
    $("#user-password").val("");  
                
  }
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

  root.numInputAdded = function(input){
    if(!root.add_money_amount)root.add_money_amount = 0;
    var amount = root.add_money_amount.toString();
    if (input == 'del') {
      amount = amount.slice(0, amount.length - 1);
    } else {
      amount += input;
    }

    root.add_money_amount = parseInt(amount);
  }
  root.numInputAdded2 = function(input){
    if(!root.withdraw_money_amount)root.withdraw_money_amount = 0;
    var amount = root.withdraw_money_amount.toString();
    if (input == 'del') {
      amount = amount.slice(0, amount.length - 1);
    } else {
      amount += input;
    }

    root.withdraw_money_amount = parseInt(amount);
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
    root.logoutTimer = 60
    if(!root.invalidAmount(amount)){
      root.updateMoney(parseInt(amount));
    }
  }

  root.withdrawMoney = function(amount){
    root.logoutTimer = 60;
    if(!root.invalidAmount(amount)){
      root.updateMoney(parseInt(-amount));
    }
  }
  root.updateMoney = function(amount){
    /*
      Update backend
    */
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
      Materialize.toast("Kunne ikke fullføre transaksjonene!");  
    });
    root.logoutTimer = 60;
  }
  
}]);


$('body').on('click', '.lean-overlay', function (e) {
    console.log($('.lean-overlay').length)
    $('.lean-overlay').remove(); // fix for multiple overlayers
});

/*$("body").click(function(){
  window.aRoot.interval = 60;
});*/
