angular.module('api.config')

.config(function($routeProvider, $httpProvider) {
  // Send AuthInterceptor with every request we make
  $httpProvider.interceptors.push('AuthInterceptor')
})
.config(function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
});
