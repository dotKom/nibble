angular.module('api.config')
.factory('Inventory', ['Resource', function ($resource) {
  return $resource('inventory/',{},{get:{isArray:true}});
}])
.factory('User', ['Resource', function ($resource) {
  return $resource('usersaldo/');
}])
.factory('Order', ['Resource', function ($resource) {
  return $resource('orderline/:user.pk/', {id: '@id'});
}])
.factory('Transaction', ['Resource', function ($resource) {
  return $resource('transactions/:id/', {id: '@id'});
}]).
factory("AuthInterceptor",["$q","$injector","$window","api.config","$rootScope",function($q,$injector,$window,api,root){
  return {
    request: function(config){
      /*config.headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      };
      config.transformRequest = function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      };*/
      token = $window.localStorage.getItem("token");
      if(token){
         config.headers["Authorization"] = "Bearer " + token;
      }
      return config; 
    },
    response: function(data){
      console.log("Response:", data);
      return data;
    },
    responseError: function(rejection){
      token = $window.localStorage.getItem("token");
      if(!root.tries){
        root.tries = 0;
      }
      if(!(root.tries >= 2) && ( !token || rejection.status == 401)){
        root.tries++;
        console.log("Requesting new token!");
        http = $injector.get("$http");
        http({
            method: "POST",
            url: api.apiRoot + "auth/",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"        
            },
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
            },
            data: {
              grant_type: "client_credentials",
              client_id: api.client_id, 
              client_secret: api.client_secret
          },
          responseType: "json",
        }).then(function(response){
          $window.localStorage.token = response.data.access_token;
          root.tries = 0;
          /*if(rejection.status == 401){
            return http(rejection.config);
          }*/
        },function(error){
          console.log("Could not renew access token! ",error);
        });
      };
      return $q.reject(rejection);
    }
  };
}]);
