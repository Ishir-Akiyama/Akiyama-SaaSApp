angular.module('commonService', [])

.factory('Common', function ($http) {
    var commonFactory = {};
    // get all client
    commonFactory.GetClientList = function () {
        return $http.get('/api/activeClients/');
    };
    return commonFactory;
});