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
    });

    $locationProvider.html5Mode(true);

});
