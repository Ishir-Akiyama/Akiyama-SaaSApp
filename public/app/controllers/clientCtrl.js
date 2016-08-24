angular.module('clientCtrl', ['clientService','commonService'])

.controller('clientController', function(Client) {
    debugger;
	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the clients at page load
	Client.all()
		.success(function(data) {

			// when all the clients come back, remove the processing variable
			vm.processing = false;

			// bind the clients that come back to vm.clients
			vm.clients = data;
		});

	// function to delete a client
	vm.deleteClient = function(id) {
		vm.processing = true;

		Client.delete(id)
			.success(function(data) {

				// get all clients to update the table
				// you can also set up your api 
				// to return the list of clients with the delete call
				Client.all()
					.success(function(data) {
						vm.processing = false;
						vm.clients = data;
					});

			});
	};
    
})

// controller applied to client creation page
.controller('clientCreateController', function(Client) {
    debugger;
	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a user
	vm.saveClient = function () {
	    debugger;
		vm.processing = true;
		vm.message = '';

		// use the create function in the clientService
		Client.create(vm.clientData)
			.success(function(data) {
				vm.processing = false;
				vm.clientData = {};
				vm.message = data.message;
			})
        //.error(function(data,status)
        //{
        //    console.error('Repos error', status, data);
        //    vm.message = data.message;
        //})
	    ;
	};	

})

// controller applied to client edit page
.controller('clientEditController', function($routeParams, Client) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the client data for the client you want to edit
	// $routeParams is the way we grab data from the URL
	Client.get($routeParams.client_id)
		.success(function(data) {
			vm.clientData = data;
		});

	// function to save the client
	vm.saveClient = function() {
		vm.processing = true;
		vm.message = '';

		// call the clientService function to update 
		Client.update($routeParams.client_id, vm.clientData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.clientData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});

