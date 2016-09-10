angular.module('clientService', [])

.factory('Client', function($http) {

	// create a new object
	var clientFactory = {};

    // get a single client
	clientFactory.get = function (id) {
		return $http.get('/api/clients/' + id);
	};

    // get all client
	clientFactory.all = function () {
	    return $http.get('/api/clients/');
	};

    //// create a client
	clientFactory.create = function (clientData) {
	    return $http.post('/api/clients/', clientData);
	};    

    // update a client
	clientFactory.update = function (id, clientData) {
	    return $http.put('/api/clients/' + id, clientData);
	};

    // delete a client
	clientFactory.delete = function (id) {
	    return $http.delete('/api/clients/' + id);
	};

	// return our entire clientFactory object
	return clientFactory;

});