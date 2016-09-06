angular.module('dashboardCtrl', ['dashboardService', 'nvd3'])

.controller('dashboardController', function (Auth, $scope) {
    var User;
    var tooltip = nv.models.tooltip();
    tooltip.duration(0);

    ///Get Login User data//////
    Auth.getUser()
			.then(function (data) {
			    User = data.data;

			    if(User.clientid)
			    {
                    //allI
			    }
			});

    // grab all the images at page load
    //$scope.allImagesByClientId
	//	.success(function (data) {
	//	    // when all the clients come back, remove the processing variable
	//	    vm.processing = false;

	//	    // bind the clients that come back to vm.clients
	//	    vm.clients = data;
	//	});
   
    $scope.data = [{
        color:"#1f77b4",
        key: "lorem ipsum dolor sit amet",
        value: 5
    }, {
        color: "#aec7e8",
        key: "lorem ipsum dolor sit amet consectetur adipisicing",
        value: 7
    },
    ]
    $scope.plainoptions = {
        chart: {
            type: 'pieChart',
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
            legendPosition: 'right'
        }
    }
    $scope.options = {
        chart: {
            type: 'pieChart',
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
            legend: {
                vers: 'furious',
                dispatch: {
                    legendMouseover: function (o) {
                        if (tooltip.hidden()) {
                            var data = {
                                series: {
                                    key: o.key,
                                    value: o.value + " words",
                                    color: o.color
                                }
                            };
                            tooltip.data(data)
                              .hidden(false);
                        }
                        tooltip.position({
                            top: d3.event.pageY,
                            left: d3.event.pageX
                        })();
                    },
                    legendMouseout: function (o) {
                        tooltip.hidden(true);
                    }
                }
            },
            legendPosition: 'right',
            valueFormat: function (d) {
                return d + " words";
            }
        }
    };
})