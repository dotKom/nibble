angular.module('api.config', ['ngResource'])
.run(['$http',function(http){
  /*Requesting config file: "config.json"*/
  http({
    url: "/config.json",
    method: "GET",
    responseType: "json"
  }).then(function(ret){
    angular.module('api.config').constant(ret.data);
  },function(error){
    console.log("Could not load config!");
  });
}]);