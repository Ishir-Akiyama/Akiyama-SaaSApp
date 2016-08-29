angular.module('imageService', [])

.factory('Image', function($http) {

	// create a new object
	var imageFactory = {};

    // get a single client
	imageFactory.get = function (name) {
		return $http.get('/api/clients/' + name);
	};

    // get all client
	imageFactory.all = function () {
	    debugger;
	    return $http.get('/api/images/');
	};

    //// create a client
	imageFactory.create = function (imageData) {
	    debugger;
	    return $http.post('/api/images/', imageData);
	};

    

    // update a client
	imageFactory.update = function (name, imageData) {
	    return $http.put('/api/images/' + name, imageData);
	};

    // delete a client
	//clientFactory.delete = function (id) {
	//    return $http.delete('/api/clients/' + id);
	//};

	// return our entire clientFactory object
	return imageFactory;

});