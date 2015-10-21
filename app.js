angular.module('nibble', [
  'ngRoute',
  'ui.materialize',
  'nibble.view1',
  'nibble.view2',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]).
controller('MainCtrl', ["$scope", function ($scope) {
        $scope.select = {
            value1: "Option1",
            value2: "I'm an option",
            choices: ["Option1", "I'm an option", "This is materialize", "No, this is Patrick."]
        };

        $scope.dummyInputs = {};

    }]);
