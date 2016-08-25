angular.module('imageCtrl', ['imageService','commonService'])

.controller('imageController', function(Image) {
    debugger;
	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the clients at page load
    Image.all()
		.success(function(data) {

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
.controller('imageCreateController', function(Image) {
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
			.success(function(data) {
				vm.processing = false;
				vm.imageData = {};
				vm.message = data.message;
			})
        //.error(function(data,status)
        //{
        //    console.error('Repos error', status, data);
        //    vm.message = data.message;
        //})
	    //;
	};


	vm.uploadFile = function (input) {
	    debugger;
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        reader.onload = function (e) {

	            //Sets the Old Image to new New Image
	            $('#photo-id').attr('src', e.target.result);

	            //Create a canvas and draw image on Client Side to get the byte[] equivalent
	            var canvas = document.createElement("canvas");
	            var imageElement = document.createElement("img");

	            imageElement.setAttribute('src', e.target.result);
	            canvas.width = imageElement.width;
	            canvas.height = imageElement.height;
	            var context = canvas.getContext("2d");
	            context.drawImage(imageElement, 0, 0);
	            var base64Image = canvas.toDataURL("image/jpeg");

	            //Removes the Data Type Prefix 
	            //And set the view model to the new value
	            vm.Bytedata = {};
	            vm.Bytedata = base64Image.replace(/data:image\/jpeg;base64,/g, '');
	        }

	        //Renders Image on Page
	        reader.readAsDataURL(input.files[0]);
	    }
	};

})

// controller applied to client edit page
.controller('imageEditController', function($routeParams, Image) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the client data for the client you want to edit
	// $routeParams is the way we grab data from the URL
    Image.get($routeParams.image_name)
		.success(function(data) {
			vm.imageData = data;
		});

	// function to save the client
	vm.saveImage = function() {
		vm.processing = true;
		vm.message = '';

		// call the clientService function to update 
	    Image.update($routeParams.image_name, vm.imageData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.imageData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});

