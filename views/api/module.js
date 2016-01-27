angular.module('api.config').
factory("AuthInterceptor",function(){
  return {
    request: function(config){
      config.headers["Authorization"] = "Bearer ABC";
      return config; 
    },
    responseError: function(rejection){
      //console.log(rejection);
      return rejection;
    }
  };
})
.config(function($routeProvider, $httpProvider) {
  // Send AuthInterceptor with every request we make
  //$httpProvider.interceptors.push('AuthInterceptor')
})
.config(function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
});
