angular.module("ppp")
.controller("ProfileCtrl", ProfileCtrl);

ProfileCtrl.$inject = ['$http', '$scope']; // для запросов на сервер

function ProfileCtrl($http, $scope){

  var vm = this;

    $scope.readURL = function(){
      if (event.target.files&&event.target.files[0]){
          vm.img = event.target.files[0];
      };

      var reader = new FileReader();

      reader.onload = function(e){
          console.log(e.target.result);
          $scope.$apply(function(){
              vm.imgPreload = e.target.result;
          })
      }

      reader.readAsDataURL(event.target.files[0]);
    };

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

        console.log("2");

        var obj = new FormData();

        obj.append("title", vm.title);
        obj.append("description", vm.description);
        obj.append("img", vm.img);

        $http.post("/api/blog", obj, {
                headers:{'Content-Type': undefined}
            })
    		.success(function(data){
    			console.log("3");
    			vm.title="";
    			vm.description="";
    			vm.blogs.push(data);
          vm.addModal = false;
    		})
    		.error(function(err){
    			alert(err.msg);
    		});

      }else{
        console.log("error");
      }
    }

}
