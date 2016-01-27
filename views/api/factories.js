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
}])
;
