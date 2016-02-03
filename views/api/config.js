angular.module('api.config', ['ngResource'])
.run(['api.config','$http',function(api,http){
  http({
    url: "/config.json",
    method: "GET",
    responseType: "json"
  }).then(function(ret){
    for(var e in ret.data){
      api[e] = ret.data[e];
    }
    console.log(api);
    //api.value('api.config',ret.data);
  },function(error){
    console.log("Could not load config!");
  });
}])
.value('api.config', {
  //Required
})