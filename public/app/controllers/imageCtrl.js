angular.module('imageCtrl', ['imageService', 'commonService'])

.controller('imageController', function (Image) {
    debugger;
    var vm = this;

    // set a processing variable to show loading things
    vm.processing = true;

    // grab all the clients at page load
    Image.all()
		.success(function (data) {

		    // when all the clients come back, remove the processing variable
		    vm.processing = false;

		    // bind the clients that come back to vm.clients
		    vm.images = data;
		});

    // function to delete a client
    //vm.deleteClient = function(id) {
    //	vm.processing = true;

    //	Client.delete(id)
    //		.success(function(data) {

    //			// get all clients to update the table
    //			// you can also set up your api 
    //			// to return the list of clients with the delete call
    //			Client.all()
    //				.success(function(data) {
    //					vm.processing = false;
    //					vm.clients = data;
    //				});

    //		});
    //};

})

// controller applied to client creation page
.controller('imageCreateController', function (Image) {
    debugger;
    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'create';

    // function to create a user
    vm.saveImage = function () {
        debugger;
        vm.processing = true;
        vm.message = '';

        // use the create function in the clientService
        Image.create(vm.imageData)
			.success(function (data) {
			    debugger;
			    vm.processing = false;

			    vm.imageData = {};
			    vm.message = data.message;
			})
        .error(function (data, status) {
            
            vm.message = data.message;
        })
        //;
    };
    //vm.setFile = function (element) {
    //    $scope.$apply(function ($scope) {
    //        vm.imageData.file = element.files[0].name;
    //    });
    //};

})

  .controller('fileCtrl', function ($scope) {
      $scope.setFile = function (element) {
          $scope.$apply(function ($scope) {
              debugger;
              $scope.image.imageData.file = element.files[0].name;
          });
      }
      $scope.stepsModel = [];

      $scope.imageUpload = function (event) {
          var files = event.target.files; //FileList object

          for (var i = 0; i < files.length; i++) {
              var file = files[i];
              $scope.image.imageData = {};
              $scope.image.imageData.name = file.name;
              $scope.image.imageData.size = file.size;
              $scope.image.imageData.type = file.type;

              var reader = new FileReader();
              reader.onload = $scope.imageIsLoaded;
              reader.readAsDataURL(file);
          }
      }

      $scope.imageIsLoaded = function (e) {
          $scope.$apply(function () {
              $scope.stepsModel.push(e.target.result);
              $scope.image.imageData.file = e.target.result;
              $scope.image.imageData.loading = true;

          });
      }
  })



// controller applied to client edit page
.controller('imageEditController', function ($routeParams, Image) {

    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'edit';

    // get the client data for the client you want to edit
    // $routeParams is the way we grab data from the URL
    Image.get($routeParams.image_name)
        .success(function (data) {
            vm.imageData = data;
        });

    // function to save the client
    vm.saveImage = function () {
        vm.processing = true;
        vm.message = '';

        // call the clientService function to update 
        Image.update($routeParams.image_name, vm.imageData)
            .success(function (data) {
                vm.processing = false;

                // clear the form
                vm.imageData = {};

                // bind the message from our API to vm.message
                vm.message = data.message;
            });
    };

});


