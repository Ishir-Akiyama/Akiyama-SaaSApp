angular.module('userApp', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService', 'clientCtrl', 'clientService', 'imageCtrl', 'imageService', 'commonService', 'agGrid', 'dashboardCtrl', 'dashboardService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

})


