angular.module('nibble', [
  'ngRoute',
  'ui.materialize',
  'nibble.view1',
  'nibble.view2',
  'nibble.login'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]).
controller('MainCtrl', ["$scope", function ($scope) {
        $scope.select = {
            value1: "Option1",
            value2: "I'm an option",
            choices: ["Option1", "I'm an option", "This is materialize", "No, this is Patrick."]
        };

        $scope.dummyInputs = {};

    }]);

  'myApp.view1',
  'myApp.view2',
  'myApp.login'
])
;