angular.module('api.config')
.factory('Inventory', ['Resource', function ($resource) {
  return $resource('inventory/:id/', {id: '@id'});
}])
.factory('User', ['Resource', function ($resource) {
  return $resource('usersaldo/:rfid/', {rfid: '@rfid'});
}])
.factory('Order', ['Resource', function ($resource) {
  return $resource('orderline/:id/', {id: '@id'});
}])
.factory('Transaction', ['Resource', function ($resource) {
  return $resource('transactions/:id/', {id: '@id'});
}]).
factory("AuthInterceptor",["$q","$injector","$window","api.config",function($q,$injector,$window,config){
  return {
    request: function(config){
      token = $window.localStorage.getItem("token");
      if(token){
        config.headers["Authorization"] = "Bearer " + token;
      }
      return config; 
    },
    responseError: function(rejection){
      token = $window.localStorage.getItem("token");
      if(!token || rejection.status == 401){
        console.log("Requesting new token!");
        http = $injector.get("$http");
        http({
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            url: config.apiRoot + "auth/",
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
            },    
            data: {
              grant_type:"client_credentials",
              client_id:config.client_id, 
              client_secret: config.client_secret
          },
          responseType: "json",
        }).then(function(response){
          $window.localStorage.token = response.data.access_token;
          if(rejection.status == 401){
            //Resending when token is renewed
            return http(rejection.config);
          }
        },function(error){
          console.log("Could not renew access token! ",error);
        });
      }
      
      return $q.reject(rejection);
    }
  };
}]);
