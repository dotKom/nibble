'use strict';

angular.module('nibble.tabs', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/tabs', {
    templateUrl: 'views/tabTest/tabTest.html',
    controller: 'tabsCtrl'
  });
}])

.controller('tabsCtrl', ['$scope', 
function($scope) {
  
}]);


