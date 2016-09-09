angular.module('dashboardCtrl', ['dashboardService', 'nvd3'])

.controller('dashboardController', function (Auth, $scope, Dashboard, Common) {

    var vm = this;

    vm.processing = true;

    //vm.imageData = {};

    var User, caseArray, val;
    var tooltip = nv.models.tooltip();
    tooltip.duration(0);

    var clientid;
    ///Get Login User data//////
    Auth.getUser()
         .then(function (data) {
             User = data.data;
             if (!User.isadmin) {
                 clientid = User.clientid;
                 vm.GetDashboardData(clientid);
             }
             else {
                 Common.GetClientList()
              .success(function (data) {
                  vm.clients = data;
                  clientid = vm.clients[0].ClientId;
                  vm.GetDashboardData(clientid);
              });
             }
         });
    $scope.percent = 100;
    //$scope.percent1 = 80;
    $scope.percent2 = 81;
    //$scope.anotherPercent =30;
    $scope.anotherOptions = {

        barColor: '#f9243f',
        scaleColor: false,
        lineWidth: 5,
        lineCap: 'circle'
    };
    vm.GetDashboardData = function (clientid) {
        vm.allImagesByClientId(clientid);
        vm.getRecentUploads(clientid);
        vm.getYesterdayToDateData(clientid);
    }

    //show status according to it's value
    var status;
    function statusRender(params) {
        var list = Common.GetStatusList();
        angular.forEach(list, function (value, key) {
            if (params == value.Statusvalue) {
                status = value.StatusName;
            }
        });
        return status;
    }

    //// grab all the images at page load
    vm.allImagesByClientId = function (clientid) {
        Dashboard.allImagesByClientId(clientid)
        .success(function (data) {
            $scope.pieData = data;
            var Data = data;
            caseArray = [];
            for (var i = 0; i < Data.length; i++) {
                var newObj = {};
                newObj["key"] = statusRender(Data[i]._id);
                newObj["value"] = Data[i].count;
                caseArray.push(newObj);
            }
            $scope.PieChartByClientId = caseArray;
        });
    }

    /////// Pie chart ///////
    $scope.plainoptions = {
        chart: {
            type: 'pieChart',
            donut: true,
            height: 200,
            x: function (d) {
                return d.key;
            },
            y: function (d) {
                return d.value;
            },
            showLabels: false,
            transitionDuration: 500,
            legend: {
                vers: 'furious'
            },
            //legendPosition: 'bottom'
        }
    }
    $scope.options = {
        chart: {
            type: 'pieChart',
            height: 460,
            x: function (d) {
                if (d.key.length > 30) {
                    return d.key.substr(0, 30) + "...";
                } else {
                    return d.key;
                }
            },
            y: function (d) {
                return d.value;
            },
            showLabels: false,
            transitionDuration: 500,            
            valueFormat: function (d) {
                return d;
            }
        }
    };

    $scope.donatoptions = {
        chart: {
            type: 'pieChart',
            donut: true,
            height: 200,
            x: function (d) {
                if (d.key.length > 30) {
                    return d.key.substr(0, 30) + "...";
                } else {
                    return d.key;
                }
            },
            y: function (d) {
                return d.value;
            },
            showLabels: false,
            transitionDuration: 500,
            growOnHover: false,
            donutRatio:1,
            showLegend: false,
            tooltip: {
                enabled:false,
            },

            valueFormat: function (d) {
                return d;
            }
        }
    };

    vm.getRecentUploads = function (clientid) {
        Dashboard.getRecentUploads(clientid)
        .success(function (data) {
            debugger;
            // when all the clients come back, remove the processing variable
            vm.processing = false;
            // bind the clients that come back to vm.clients
            $scope.RecentUploads = data;
        });
    }



    vm.getYesterdayToDateData = function (clientid) {
        Dashboard.getYesterdayToDateData(clientid)
        .success(function (data) {
            debugger;
            // when all the clients come back, remove the processing variable
            vm.processing = false;
            // bind the clients that come back to vm.clients
            $scope.yearToDate = data;
        });
    }

    $scope.yesterday = [
                {
                    key: "One",
                    value: 3
                },
                {
                    key: "Two",
                    value: 7
                }
    ];

    $scope.month = [
              {
                  key: "One",
                  value: 7
              },
              {
                  key: "Two",
                  value: 5
              }
    ];

    $scope.lastmonth = [
              {
                  key: "One",
                  value: 3
              },
              {
                  key: "Two",
                  value: 7
              }
    ];

    $scope.year = [
              {
                  key: "One",
                  value: 10
              },
              {
                  key: "Two",
                  value: 0
              }
    ];


})