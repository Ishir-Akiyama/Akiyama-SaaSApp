angular.module('imageService', [])

.factory('Image', function ($http, Auth) {

    // create a new object
    var imageFactory = {};

    // get a single client
    imageFactory.get = function (name) {
        return $http.get('/api/clients/' + name);
    };


    // get all client
    imageFactory.all = function () {
        debugger;

        var imageData = {};
        ///Get Login User data//////
        Auth.getUser()
                .then(function (data) {
                    User = data.data;

                    if (User.clientid) {
                        imageData.clientid = User.clientid;
                    }
                });

        //var clientid = 12;
        return $http.get('/api/images/' , imageData);
    };

    //// create a client
    imageFactory.create = function (imageData) {
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