angular.module('dashboardService', [])

.factory('Dashboard', function($http) {

	// create a new object
	var dashboardFactory = {};

	dashboardFactory.allImagesByClientId = function (clientId) {
	    debugger;
	    return $http.get('/api/dashboard');
	};

	// return our entire clientFactory object
	return dashboardFactory;

});