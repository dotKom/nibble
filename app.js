angular.module('nibble', [
  'ngRoute',
  'ui.materialize',
  'nibble.view1',
  'nibble.view2',
  'nibble.login',
  'nibble.shop'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]).
controller('MainCtrl', ["$scope", function ($scope) {
  /*Not used*/  
  $scope.select = {
        value1: "Option1",
        value2: "I'm an option",
        choices: ["Option1", "I'm an option", "This is materialize", "No, this is Patrick."]
    };

    $scope.dummyInputs = {};

}]).run(["$rootScope",function(root){
  /*Definitions of root functions:*/
  root.development = true;
  root.logout = function(){
    root.user = null;
  }
}])
;