angular.module('commonService', [])

.factory('Common', function ($http) {

    // create a new object
    var commonFactory = {};
    // get all client
    commonFactory.GetClientList = function () {
        return $http.get('/api/activeClients/');
    };
});