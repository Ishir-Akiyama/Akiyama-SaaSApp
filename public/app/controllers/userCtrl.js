angular.module('userCtrl', ['userService', 'commonService'])

.controller('userController', function (User, Client) {
    var i = 0;
    var vm = this;

    // set a processing variable to show loading things
    vm.processing = true;

    //grab all client list
     Client.all()
		.success(function(data) {
		    // when all the clients come back, remove the processing variable
		    vm.processing = false;

		    // bind the clients that come back to vm.clients
		    vm.clients = data;
		});

    // grab all the users at page load
    User.all()
		.success(function (data) {
		    // when all the users come back, remove the processing variable
		    vm.processing = false;

		    // bind the users that come back to vm.users
		    vm.users = data;
            //show client name
             angular.forEach(vm.users, function (value, key) {
                angular.forEach(vm.clients, function (cvalue, key) {
                    if (cvalue.ClientId == value.clientid) {
                        vm.users[i].clientname = cvalue.name;
                    }               
                });              
            i++;
            });
		    vm.users = data;
		});

    // function to delete a user
    vm.deleteUser = function (id) {
        vm.processing = true;

        User.delete(id)
			.success(function (data) {

			    // get all users to update the table
			    // you can also set up your api 
			    // to return the list of users with the delete call
			    User.all()
					.success(function (data) {
					    vm.processing = false;
					    vm.users = data;
					});

			});
    };

})

// controller applied to user creation page
.controller('userCreateController', function (User, Common, $location) {
    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'create';
    //show active clients
    Common.GetClientList()
          .success(function (data) {
              vm.processing = false;
              vm.clients = data;
          });
    // function to create a user
    vm.saveUser = function () {
        vm.processing = true;
        vm.message = '';

        // use the create function in the userService
        User.create(vm.userData)
			.success(function (data) {
			    vm.processing = false;
			    //vm.userData = {};
			    if (data.message != "User created!")
			        vm.message = data.message;
			    else
			    {
			        vm.userData = {};
			        $location.path('/users');
			    }
			});
    };

})

// controller applied to user edit page
.controller('userEditController', function ($routeParams, User, Common, $location) {

    var vm = this;
    //show active clients
    Common.GetClientList()
           .success(function (data) {
               vm.processing = false;
               vm.clients = data;
           });
    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'edit';

    // get the user data for the user you want to edit
    // $routeParams is the way we grab data from the URL
    User.get($routeParams.user_id)
		.success(function (data) {
		    vm.userData = data;
		});

    // function to save the user
    vm.saveUser = function () {
        vm.processing = true;
        vm.message = '';
        if (vm.userData.isadmin == false)
        {
            if(vm.userData.clientid != '' && vm.userData.clientid != undefined)
            {
                // call the userService function to update 
                User.update($routeParams.user_id, vm.userData)
                    .success(function (data) {
                        vm.processing = false;
                        if (data.message != "User updated!")
                            vm.message = data.message;
                        else
                        {
                            // clear the form
                            vm.userData = {};
                            $location.path('/users');
                        }
                    });
            }
            else
            {
                vm.userData.Error = '';
                vm.userData.Error = 'Please select client';
                return false;
            }
        }
        else
        {
            User.update($routeParams.user_id, vm.userData)
                 .success(function (data) {
                     vm.processing = false;
                     if (data.message != "User updated!")
                         vm.message = data.message;
                     else {
                         // clear the form
                         vm.userData = {};
                         $location.path('/users');
                     }
                 });
        }

    };

})

.controller('changepasswordController', function (User, $location, $scope) {

    var password = document.getElementById("password"), confirm_password = document.getElementById("confirm_password");

    function validatePassword(){
        if(password.value != confirm_password.value) {
            confirm_password.setCustomValidity("Passwords Don't Match");
        } else {
            confirm_password.setCustomValidity('');
        }
    }

    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;

    var vm = this;
    // function to update user password
    vm.dochangePassword = function () {
        vm.processing = true;
        vm.message = '';
        // call the userService function to update 
        User.changePassword(vm.userData)
			.success(function (data) {
			    vm.processing = false;
			    // clear the form
			    vm.userData = {};
			    // bind the message from our API to vm.message
			    vm.message = data.message;
			    $location.path('/dashboard');
			});
    };

});