angular.module('api.config')
.factory( 'Resource', [ '$resource', 'api.config', function($resource, config) {
    return function( url, params, methods ) {
        var defaults = {
            update: { method: 'put', isArray: false },
            create: { method: 'post' },
            options: { method: 'options'}
        };

        methods = angular.extend( defaults, methods );
        var resource = $resource( config.apiRoot+url, params, methods );

        resource.prototype.$save = function() {
            if(!this.id){
               return this.$create();
            }
            else{
               return this.$update();
            }
        };

       return resource;
   };
}])