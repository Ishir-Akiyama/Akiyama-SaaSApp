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
        return $http.get('/api/images/',imageData);
    };

    //// create a client
    imageFactory.create = function (imageData) {
        return $http.post('/api/images/', imageData);
    };



    // update a client
    imageFactory.update = function (id, imageData) {
        return $http.put('/api/images/' + id, imageData);
    };

 // update a client
    imageFactory.findByClient = function (id) {
        return $http.get('/api/images/' + id);
    };

    // update a client
    imageFactory.scoreImageSchduler = function (id) {
        return $http.post('/api/images/' + id);
    };
     
    //Find report by passing 3 parameter
    imageFactory.findClientData = function (config) {
        return $http.post('/api/report/', config);
    };

    // return our entire clientFactory object
    return imageFactory;

});