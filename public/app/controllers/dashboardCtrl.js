angular.module('dashboardCtrl', ['dashboardService', 'nvd3'])

.controller('dashboardController', function (Auth, $scope, Dashboard, Common) {

    var vm = this;

    vm.processing = true;

    var User, val;
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
                 if (!User.isadmin)
                     vm.triggerImageScoreScheduler(clientid);

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
        vm.getYearToDateData(clientid);
        vm.getYesterdayToDateData(clientid);
        vm.getMonthdayToDateData(clientid);
        vm.getLastMonthToDateData(clientid);
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
            donutRatio: 1,
            showLegend: false,
            tooltip: {
                enabled: false,
            },
            valueFormat: function (d) {
                return d;
            }
        }
    };

    //// Get Pie chart data on page load
    vm.allImagesByClientId = function (clientid) {
        Dashboard.allImagesByClientId(clientid)
        .success(function (data) {
            var caseArray;
            $scope.pieData = data;
            var Data = data;
            caseArray = [];
            for (var i = 0; i < Data.length; i++) {
                var newObj = {};
                if (Data[i]._id == -1)
                    newObj["color"] = "#afabaa";
                if (Data[i]._id == 0)
                    newObj["color"] = "#b90000";
                if (Data[i]._id == 1)
                    newObj["color"] = "#3bc2f2 ";
                if (Data[i]._id == 2)
                    newObj["color"] = "#fed966";
                if (Data[i]._id == 3)
                    newObj["color"] = "#2d74b4";
                if (Data[i]._id == 4)
                    newObj["color"] = "#f07f2f";
                if (Data[i]._id == 5)
                    newObj["color"] = "#548237";
                newObj["key"] = statusRender(Data[i]._id);
                newObj["value"] = Data[i].count;
                caseArray.push(newObj);
            }
            $scope.PieChartByClientId = caseArray;
        });
    }

    //// Get Recent uploads data on page load
    vm.getRecentUploads = function (clientid) {
        Dashboard.getRecentUploads(clientid)
        .success(function (data) {
            $scope.RecentUploads = data;
        });
    }

    //// Get Recent uploads data on page load
    vm.triggerImageScoreScheduler = function (clientid) {
        Dashboard.scoreImageSchduler(clientid)
        .success(function (data) {
           // need to do nothing...
        });
    }

    var totalyear;
    //// Get year data on page load
    vm.getYearToDateData = function (clientid) {
        Dashboard.getYearToDateData(clientid)
        .success(function (data) {
            $scope.yearData = data;
            var caseArrayYear;
            totalyear = data;
            var Data = data;
            caseArrayYear = [];
            var newObj = {};
            if (data == 0) {
                newObj["color"] = "#d8d8d8";
                newObj["key"] = "Count";
                newObj["value"] = 100;
            }
            else {
            newObj["color"] = "#f5626a";
            newObj["key"] = "Count";
            newObj["value"] = Data;
            }
            caseArrayYear.push(newObj);
            $scope.year = caseArrayYear;
        });
    }

    //// Get yesterday data on page load
    vm.getYesterdayToDateData = function (clientid) {
        Dashboard.getYesterdayToDateData(clientid)
        .success(function (data) {
            $scope.yesterdayData = data;
            var caseArray;
            var Data = data;
            if (data == 0) {
            caseArray = [];
                var obj = {};
                obj["color"] = "#d8d8d8";
                obj["key"] = "Count";
                obj["value"] = 100;
                caseArray.push(obj);
            }
            else {
                caseArray = [];
            var newObj = {};
            newObj["color"] = "#f5626a";
            newObj["key"] = "Count";
            newObj["value"] = Data;
            caseArray.push(newObj);
            var newObj1 = {};
            newObj1["color"] = "#d8d8d8";
            newObj1["key"] = "Count";
            newObj1["value"] = totalyear - Data;
            caseArray.push(newObj1);
            }
            $scope.yesterday = caseArray;
        });
    }

    //// Get month data on page load
    vm.getMonthdayToDateData = function (clientid) {
        Dashboard.getMonthdayToDateData(clientid)
        .success(function (data) {
            $scope.monthData = data;
            var caseArrayMonth;
            var Data = data;
            if (data == 0) {
                caseArrayMonth = [];
                var obj = {};
                obj["color"] = "#d8d8d8";
                obj["key"] = "Count";
                obj["value"] = 100;
                caseArrayMonth.push(obj);
            }
            else {
            caseArrayMonth = [];
            var newObj = {};
            newObj["color"] = "#f5626a";
            newObj["key"] = "Count";
            newObj["value"] = Data;
            caseArrayMonth.push(newObj);
            var newObj1 = {};
            newObj1["color"] = "#d8d8d8";
            newObj1["key"] = "Count";
            newObj1["value"] = totalyear - Data;
            caseArrayMonth.push(newObj1);
            }
            $scope.month = caseArrayMonth;
        });
    }

    //// Get last month data on page load
    vm.getLastMonthToDateData = function (clientid) {
        Dashboard.getLastMonthToDateData(clientid)
        .success(function (data) {
            vm.processing = false;
            $scope.lastMonthData = data;
            var caseArrayl;
            var Data = data;
            if (data == 0) {
                caseArrayl = [];
                var obj = {};
                obj["color"] = "#d8d8d8";
                obj["key"] = "Count";
                obj["value"] = 100;
                caseArrayl.push(obj);
            }
            else {
            caseArrayl = [];
            var newObj = {};
            newObj["color"] = "#f5626a";
            newObj["key"] = "Count";
            newObj["value"] = Data;
            caseArrayl.push(newObj);
            var newObj1 = {};
            newObj1["color"] = "#d8d8d8";
            newObj1["key"] = "Count";
            newObj1["value"] = totalyear - Data;
            caseArrayl.push(newObj1);
            }
            $scope.lastmonth = caseArrayl;
        });
    }
})