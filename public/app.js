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


    vm.del = function(blog){

      $http.delete("/api/blog/" + blog._id)
      .success(function(data){
          var index = vm.blogs.indexOf(blog);
          vm.blogs.splice(index, 1);
      }).error(function(err){ alert(err.msg);  });
     }

    vm.saveBlog = function() {
      console.log("1");
      if(vm.title&&vm.title!=""&&vm.description&&vm.description!=""){

      $http.post('/api/blog', {'title': vm.title, 'description': vm.description})
      .success(function(data){
        console.log("2");
        vm.title = "";
        vm.description = "";
        vm.blogs.push(data);
        vm.addModal = false;
      })
      .error(function(err){
        alert(err.mgs)
      });

      }
    }

}
