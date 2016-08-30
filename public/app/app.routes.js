angular.module('app.routes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {

    $routeProvider

		// route for the home page
		.when('/', {
		    templateUrl: 'app/views/pages/home.html'
		})

		// login page
		.when('/login', {
		    templateUrl: 'app/views/pages/login.html',
		    controller: 'mainController',
		    controllerAs: 'login'
		})

        // show all users
		.when('/dashboard', {
		    templateUrl: 'app/views/pages/dashboard.html'
		    // controller: 'userController',
		    //controllerAs: 'user'
		})

        // show all users
		.when('/report', {
		    templateUrl: 'app/views/pages/reports.html'
		    // controller: 'userController',
		    //controllerAs: 'user'
		})

		// show all users
		.when('/users', {
		    templateUrl: 'app/views/pages/users/all.html',
		    controller: 'userController',
		    controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
		    templateUrl: 'app/views/pages/users/single.html',
		    controller: 'userCreateController',
		    controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/:user_id', {
		    templateUrl: 'app/views/pages/users/single.html',
		    controller: 'userEditController',
		    controllerAs: 'user'
		})

    // show all clients
	.when('/clients', {
	    templateUrl: 'app/views/pages/clients/all.html',
	    controller: 'clientController',
	    controllerAs: 'client'
	})

    // form to create a new client
    // same view as edit page
    .when('/clients/create', {
        templateUrl: 'app/views/pages/clients/single.html',
        controller: 'clientCreateController',
        controllerAs: 'client'
    })

    // page to edit a client
    .when('/clients/:client_id', {
        templateUrl: 'app/views/pages/clients/single.html',
        controller: 'clientEditController',
        controllerAs: 'client'
    })

    //for forgot password
     .when('/forgotPassword', {
         templateUrl: 'app/views/pages/forgotPassword.html',
         controller: 'forgotpasswordController',
         controllerAs: 'forgotPassword'
     })
    // show all images
    .when('/images', {
        templateUrl: 'app/views/pages/images/all.html',
        controller: 'imageController',
        controllerAs: 'image'
    })

    // form to create a new image
    .when('/images/create', {
        templateUrl: 'app/views/pages/images/single.html',
        controller: 'imageCreateController',
        controllerAs: 'image'
    })

    // login page
    .when('/changePassword', {
        templateUrl: 'app/views/pages/change-password.html'
        //controller: 'mainController',
        //controllerAs: 'login'
    });

    $locationProvider.html5Mode(true);

});
