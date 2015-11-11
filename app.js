angular.module('nibble', [
  'ngRoute',
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

}]).run(["$rootScope",function(root){
  /*Definitions of root functions:*/
  root.development = true;
  root.add_amounts = [10, 15, 20, 40, 50, 100, 200, 400, 500];
  root.add_money_amount = "";
  
  root.logout = function(){
    root.rfid = null;
    root.user = null;
    root.showBalModule = false;
  }

  root.validAmount = function(){
    console.log("Valid money amount: " + root.add_money_amount);
    if(root.add_money_amount != "" && root.add_money_amount>0){
      return true;
    }
    return false;
  }
}]);
