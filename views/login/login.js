'use strict';

angular.module('nibble.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/login/login.html',
    controller: 'loginCtrl'
  });
}])
.controller('loginCtrl', ["$rootScope","$http","$location",function(root,http,location) {
  $("#reg-form").submit(function(e){
    e.preventDefault();
    http({
      method: "POST",
      data: {rfid: root.rfid}
    }).then(function(ret){
      /*Success*/
      if(ret.data){
        root.user = ret.data;
      }else{
        
      }
    },function(error){
      /*Fail*/
      
    });
    /*Registration code:*/
  });

  /*
  Item list should be loaded in app to be used by both shop and login (?)
  */
  var testItem = {oId:"a1",id:"1","name":"Øl", "description":"0.5L Dahls på glassflaske", "price":"20", "amount":42, "available":true, "category":"drikke", 
                  "image": "http://3.bp.blogspot.com/_eBUfxxSLsVw/TSoQTbARxiI/AAAAAAAAAEk/V927sCd8uRU/s1600/dahls.png","dispCount":0};
  var testItem2 = {oId:"a2", id:"2","name":"Billys", "description":"Dypfryst pizza med ost og skinke", "price":20, "amount":42, "available":true, 
                  "category":"mat", "image": "http://www.brynildsen.no/upload/Billys-original-NY.png","dispCount":0};
  var testItem3 = {oId:"a3", id:"3","name":"Rett i koppen", "description":"Mat...", "price":40, "amount":42, "available":true, 
                  "category":"mat", "image": "http://www.lunsj.no/14636-thickbox_default/knorr-tomatsuppe.jpg","dispCount":0};
  /**/
  var testItem4 = {oId:"a4", id:"4","name":"Solbærtoddy", "description":"Toddy", "price":25, "amount":42, "available":true, "category":"drikke", "image": "http://proddb.kraft-hosting.net/prod_db/proddbimg/11324.png","dispCount":0};
  
  var testItem5 = {oId:"a5", id:"5","name":"Kinder: bueno", "description":"Kinder", "price":10, "amount":42, "available":true, "category":"snacks", "image": "http://www.kinder.me/image/journal/article?img_id=7231869&t=1445520902223","dispCount":0};
  

  root.items = [testItem, testItem2, testItem3, testItem4, testItem5, testItem, testItem2, testItem3, testItem4];
  
  root.itemCols = [root.items.slice(0, Math.ceil(root.items.length/2)), root.items.slice(Math.ceil(root.items.length/2))]


  $("#rfid-form").submit(function(e){
    /*Validation and 'login' code:*/
    e.preventDefault();
    root.rfid = $("#rfid-input").value;
    console.log(root.rfid);
    root.validation_fail = false;
    //Check if a user is assosiated with the rfid
    //$http request:
    http({
      url: "login/",
      method: "post",
      data: {rfid: root.rfid}
    }).then(function(ret){
        /*Success*/
        if(ret.data){
          root.user = ret.data; //<-- if data is json??
          location.url("/shop");
        }
        else{
          root.rfid = null;
          root.validation_fail = true;
          Materialize.toast("Validation failed!", 2000);
          Materialize.toast("Fill inn username and password", 2000);
        }
      },
      function(error){
        /*Fail*/
        /*Only called when an error respons occurs*/
        root.rfid = null;
        root.user = null;
        root.validation_fail = false;
        console.log(error);
        Materialize.toast("[Error] Server returned error code: " + error.status, 4000);
        /*Display error in card?*/
      
        /*Temp test code: */
        if(root.development){  
          location.url("/shop");
        }
      }

    );
  });
}]);