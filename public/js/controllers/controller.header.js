angular.module("ppp")
.controller("HeaderCtrl", HeaderCtrl);

HeaderCtrl.$inject = ['$http', "$state"];

function HeaderCtrl($http, $state){

  var vm = this;

  vm.singup = function(){
    console.log("in singup()");
    $http.post('/api/user/signup', {
      email: vm.email,
      first_name: vm.first_name,
      last_name: vm.last_name,
      password: vm.password,
      password2: vm.password2
    }).success(function(data){
      console.log(data);
      vm.showSignup = false;
      vm.showLogin = true;
    }).error(function(err){
      vm.errors = err;
    })
  }

  vm.login = function(){
    // console.log('login');
    $http.post('/api/user/login', {
      email: vm.emailLogin,
      password: vm.passwordLogin
    }).success(function(data){
      console.log(data);
        vm.showLogin = false;
        vm.user = data;
        $state.go('profile', {user_id: vm.user_id})
    }).error(function(err){
      vm.errorsLogin = err;
    })
  }

   vm.logout = function () {
     // console.log('logout');
     $http.post('/api/user/logout')
     .success(function(){
       $state.go('home');
       vm.user = undefined;
     })
     .error(function(err){

     })
   }
}
