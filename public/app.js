angular.module("ppp", [])
.controller("ProfileCtrl", ProfileCtrl);

ProfileCtrl.$inject = ['$http', '$scope']; // для запросов на сервер

function ProfileCtrl($http, $scope){

  var vm = this;


    $http.get('/api/blog')
    .success(function(data){
    	console.log(data);
    	vm.blogs = data;
    })
    .error(function(err){
    	alert(err.msg);
    });





}
