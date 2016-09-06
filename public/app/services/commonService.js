angular.module('commonService', [])

.factory('Common', function ($http) {
    var commonFactory = {};
    // get all client
    commonFactory.GetClientList = function () {
        return $http.get('/api/activeClients/');
    };

    //Status List
    var StatusList = [
        { "StatusName": 'Pending', "Statusvalue": -1 },
        { "StatusName": 'Not Scored', "Statusvalue": 0 },
        { "StatusName": 'Poor', "Statusvalue": 1 },
        { "StatusName": 'Ok', "Statusvalue": 2 },
        { "StatusName": 'Good', "Statusvalue": 3 },
        { "StatusName": 'Best', "Statusvalue": 4 },
        { "StatusName": 'Excellent', "Statusvalue": 5 },
    ];

    //Get Status List
    commonFactory.GetStatusList = function () {
        return StatusList;
    };
    return commonFactory;
});