angular.module('api.config', ['ngResource'])
.run(['api.config','$http',function(api,http){
  http({
    url: "/config.json",
    method: "GET",
    responseType: "json"
  }).then(function(ret){
    angular.module('api.config').constant(ret.data);
  },function(error){
    console.log("Could not load config!");
  });
}])
.value('api.config', {
  //Required? :o
});