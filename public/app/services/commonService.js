angular.module('commonService', [])

.factory('Common', function ($http) {

    debugger;
   // var allScopes = {};
    //allScopes = $rootscope;
    // create a new object
    var commonFactory = {};
    // get all client
    commonFactory.GetClientList = function () {
        return $http.get('/api/activeClients/');
    };
    return commonFactory;
});