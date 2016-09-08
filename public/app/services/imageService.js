angular.module('imageService', [])

.factory('Image', function ($http, Auth) {

    // create a new object
    var imageFactory = {};

    // get a single client
    imageFactory.get = function (name) {
        return $http.get('/api/clients/' + name);
    };


    // get all client
    imageFactory.all = function (imageData) {
        debugger;
              
        return $http.get('/api/images/',imageData);
    };

    //// create a client
    imageFactory.create = function (imageData) {
        return $http.post('/api/images/', imageData);
    };



    // update a client
    imageFactory.update = function (name, imageData) {
        return $http.put('/api/images/' + name, imageData);
    };

 // update a client
    imageFactory.findByClient = function (id) {
        return $http.get('/api/images/' + id);
    };
     

    // return our entire clientFactory object
    return imageFactory;

});