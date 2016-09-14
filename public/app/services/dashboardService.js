angular.module('dashboardService', [])

.factory('Dashboard', function ($http) {

    // create a new object
    var dashboardFactory = {};

    dashboardFactory.allImagesByClientId = function (clientid) {
        return $http.get('/api/dashboardchart/' + clientid);
    };

    dashboardFactory.getRecentUploads = function (clientid) {
        return $http.get('/api/dashboard/' + clientid);
    };

    // update a client
    dashboardFactory.scoreImageSchduler = function (clientid) {
        return $http.post('/api/dashboard/' + clientid);
    };


    dashboardFactory.getYearToDateData = function (clientid) {
        return $http.get('/api/dashboardYear/' + clientid);
    };

    dashboardFactory.getYesterdayToDateData = function (clientid) {
        return $http.get('/api/dashboardYesterday/' + clientid);
    };

    dashboardFactory.getMonthdayToDateData = function (clientid) {
        return $http.get('/api/dashboardMonth/' + clientid);
    };

    dashboardFactory.getLastMonthToDateData = function (clientid) {
        return $http.get('/api/dashboardLastMonth/' + clientid);
    };    

    // return our entire clientFactory object
    return dashboardFactory;

});