'use strict';

angular.module('nibble.kvitering', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/kvitering', {
    templateUrl: 'views/kvitering/kvitering.html',
    controller: 'kviteringCtrl'
  });
}])
.controller('kviteringCtrl',function($rootScope,$scope,$interval,$location) {
  if(!$rootScope.user){
    $rootScope.user = {name: "testUser",balance: 1000};
    /*$location.url("/");
    Materialize.toast("You need to login first!", 4000);
    return;*/
  }
  $scope.logoutTimer = 10;
  $scope.time = new Date();
  $scope.dTime = new Date();
  $scope.floor = Math.floor;
  $scope.interval = $interval(function(){
    $scope.dTime =new Date() - $scope.time;
    $scope.time = new Date();
    $scope.logoutTimer -= $scope.dTime/1000;
    
    if($scope.logoutTimer <= 0){
      $scope.logoutTimer = 0;
      $rootScope.logout();
      $location.url("/");
    }
  }, 50);
  $scope.$on('$destroy', function(){
    $interval.cancel($scope.interval);
  });
});