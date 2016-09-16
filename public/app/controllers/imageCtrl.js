agGrid.initialiseAgGridWithAngular1(angular);
angular.module('imageCtrl', ['imageService', 'commonService'])
.controller('imageController', function (Image, Auth) {
    var vm = this;
    // set a processing variable to show loading things
    vm.processing = true;
    vm.type = 'get';


    vm.getImages = function (temp) {
        vm.processing = true;
        vm.message = '';
        vm.imageData = {};
        vm.imageData.clientId = temp;
        // use the create function in the clientService
        Image.findByClient(temp)
       .success(function (data) {
           // when all the clients come back, remove the processing variable
           vm.processing = false;
           // bind the clients that come back to vm.clients
           vm.images = data;
           vm.putScores(temp);
       })
        .error(function (data, status) {
            vm.processing = false;
            vm.message = data.message;
        });
    };

    vm.putScores = function (temp) {
        //vm.processing = true;
        vm.message = '';
        vm.imageData = {};
        vm.imageData.clientId = temp;
        // use the create function in the clientService
        Image.scoreImageSchduler(temp)
       .success(function (data) {
           // when all the clients come back, remove the processing variable
           // vm.processing = false;

           // bind the clients that come back to vm.clients
           vm.images = data;
       });
        //.error(function (data, status) {
        //    vm.message = data.message;
        //})
    };

})

    .controller('ShowHideCtrl', function ($scope) {
        $scope.btnText = "Show Image";
        //This will hide the DIV by default.
        $scope.IsVisible = false;
        $scope.ShowHide = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.IsVisible = $scope.IsVisible ? false : true;
            $scope.btnText = $scope.IsVisible ? 'Hide Image' : 'Show Image';
        }
    })


// controller applied to client creation page
.controller('imageCreateController', function (Image, $location, $scope, $window) {
    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'create';

    // function to create a user
    vm.saveImage = function (client, user) {
        vm.processing = true;
        vm.message = '';
        vm.imageData.clientId = client;
        vm.imageData.user = user;
        // use the create function in the clientService
        Image.create(vm.imageData)
			.success(function (data) {
			    vm.processing = false;
			    vm.imageData = {};
			    localStorage.setItem('tempCurrenttabId', 1);
			    if (data.message.indexOf("Failed") == -1)
			        $location.path('/dashboard');
			    else
			        vm.message = data.message;
			})
        .error(function (data, status) {
            vm.message = data.message;
        })
    };
})

  .controller('fileCtrl', function ($scope) {

      $scope.setFile = function (element) {
          $scope.$apply(function ($scope) {
              $scope.image.imageData.file = element.files[0].name;
          });
      }
      $scope.image.imageData = {};
      $scope.stepsModel = [];

      $scope.imageUpload = function (event) {
          var files = event.target.files; //FileList object

          for (var i = 0; i < files.length; i++) {
              var file = files[i];

              $scope.image.imageData.filename = file.name;
              $scope.image.imageData.type = file.type;


              var reader = new FileReader();
              if (file.name.indexOf(".xls") > -1 || file.name.indexOf(".csv") > -1)
                  reader.onload = $scope.excelIsLoaded;
              else
                  reader.onload = $scope.imageIsLoaded;
              reader.readAsDataURL(file);
          }
      }

      $scope.imageIsLoaded = function (e) {
          $scope.$apply(function () {
              $scope.step = e.target.result;

              $scope.image.imageData.file = e.target.result;

          });
      }

      $scope.excelIsLoaded = function (e) {
          $scope.$apply(function () {
              $scope.step = "data:image/png;base64,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";

              $scope.image.imageData.file = e.target.result;
          });
      }
         

  })


// controller applied to client edit page
.controller('imageEditController', function ($routeParams, Image, $location) {

    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'edit';

    // get the client data for the client you want to edit
    // $routeParams is the way we grab data from the URL
    Image.get($routeParams.image_name)
        .success(function (data) {
            vm.imageData = data;
        });

    // function to save the client
    vm.saveImage = function () {
        vm.processing = true;
        vm.message = '';

        // call the clientService function to update 
        Image.update($routeParams.image_name, vm.imageData)
            .success(function (data) {
                vm.processing = false;
                // clear the form
                vm.imageData = {};
                // bind the message from our API to vm.message
                vm.message = data.message;
              
            });
    };

})

.controller('reportController', function ($scope, Image, Common, Auth) {
    var vm = this;

    // set a processing variable to show loading things
    vm.processing = true;

    var columnDefs = [
         { headerName: "Name", field: "name", cellStyle: { color: 'darkred' }, width: 130 },
        { headerName: "Image Name", field: "filename", cellRenderer: imageRender, width: 220 },
        { headerName: "Type", field: "type", width: 130 },
        { headerName: "Uploaded On", field: "uploadedOn", width: 220, cellRenderer: dateRender },
        { headerName: "Status", field: "status", width: 120 },
        { headerName: "Image", field: "byte", width: 130, hide: true }
    ];

    //Ag grid setting
    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowSelection: 'multiple',
        enableColResize: false,
        enableSorting: false,
        groupHeaders: true,
        suppressMovableColumns: true,
        rowHeight: 22,
        suppressRowClickSelection: true,
        enableFilter: false,
        angularCompileRows: true,
        paginationPageSize: 10,
        rowModelType: 'pagination',
        debug: true,

    };

    //get image
    function imageRender(params) {
        params.$scope.imageData = params.data.byte;
        return "<img data-ng-src='{{imageData}}' data-err-src='images/png/avatar.png' height='500px' width='500px' />";
    }

    //for date format
    function dateRender(params) {
        var a = params.data.uploadedOn;
        var date = new Date(a);
        var mm = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        var dd = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var yyyy = date.getFullYear();
        var newDate = dd + "/" + mm + "/" + yyyy;
        return params.$scope.dateRender = newDate;
    }
    //for filter
    $scope.onFilterChanged = function (Passvalue) {
        var list = Common.GetStatusList();
        $scope.gridOptions.api.setQuickFilter(Passvalue);
        //get status name according to status value

    }
    // when json gets loaded, it's put here, and  the datasource reads in from here.
    // in a real application, the page will be got from the server.
    var allOfTheData;

    function setRowData(rowData) {
        allOfTheData = rowData;
        createNewDatasource();
    }
    function createNewDatasource() {
        if (!allOfTheData) {
            // in case user selected 'onPageSizeChanged()' before the json was loaded
            return;
        }

        var dataSource = {
            paginationPageSize: parseInt($scope.paginationPageSize),
            //rowCount: ???, - not setting the row count, infinite paging will be used
            getRows: function (params) {
                // this code should contact the server for rows. however for the purposes of the demo,
                // the data is generated locally, a timer is used to give the experience of
                // an asynchronous call
                console.log('asking for ' + params.startRow + ' to ' + params.endRow);
                setTimeout(function () {
                    // take a chunk of the array, matching the start and finish times
                    //var dataAfterSortingAndFiltering = sortAndFilter(params.sortModel, params.filterModel);
                    var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                    // see if we have come to the last page. if we have, set lastRow to
                    // the very last row of the last page. if you are getting data from
                    // a server, lastRow could be returned separately if the lastRow
                    // is not in the current page.
                    var lastRow = -1;
                    if (allOfTheData.length <= params.endRow) {
                        lastRow = allOfTheData.length;
                    }
                    params.successCallback(rowsThisPage, lastRow);
                }, 500);
            }
        };
        document.addEventListener('DOMContentLoaded', function () {
            var gridDiv = document.querySelector('#myGrid');
            new agGrid.Grid(gridDiv, gridOptions);
        });
        $scope.gridOptions.api.setDatasource(dataSource);
    }

    //ag-grid export data
    $scope.onBtExport = function () {
        var i = 0;
        var params = {
            allColumns: true
        };

        //change date format at export to csv 
        angular.forEach($scope.gridOptions.api.rowModel.rowsToDisplay, function (value, key) {

            var date = new Date(value.data.uploadedOn);
            var mm = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
            var dd = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
            var yyyy = date.getFullYear();
            var newDate = dd + "/" + mm + "/" + yyyy;
            value.data.uploadedOn = newDate;
        });
        i++;

        $scope.gridOptions.api.exportDataAsCsv(params);
    };

    Auth.getUser()
        .then(function (data) {
            vm.user = data.data;
            if (vm.user.isadmin == true) {
                Common.GetClientList()
               .success(function (data) {
                   vm.processing = false;
                   vm.adminvalue = vm.user.isadmin;
                   vm.clients = data;
               });
                vm.filterGrid = function (clientId, fromdate, todate) {
                    document.getElementById('myGrid').style.display = "block";
                    var i = 0;
                    var list = Common.GetStatusList();
                    if (fromdate == undefined) {
                        vm.Error = '';
                        vm.Error = 'Please select start date';
                        return false;
                    }
                    if (todate == undefined) {
                        vm.Error = '';
                        vm.Error = 'Please select end date';
                        return false;
                    }
                    if (clientId == undefined) {
                        vm.Error = '';
                        vm.Error = 'Please select client';
                        return false;
                    }
                    vm.Error = '';
                    vm.processing = true;
                    vm.message = '';
                    vm.reportparam = {};
                    vm.reportparam.clientId = clientId;
                    vm.reportparam.fromdate = fromdate;
                    vm.reportparam.todate = todate;
                    Image.findClientData(vm.reportparam)
                   .success(function (data) {
                       vm.processing = false;
                       vm.images = data;
                       document.getElementById('hiddenID').value = data.length;
                       allOfTheData = data;
                       debugger
                       createNewDatasource();
                       //show status according to it's value
                       angular.forEach(data, function (value, key) {
                           angular.forEach(list, function (lvalue, key) {
                               if (lvalue.Statusvalue == value.status) {
                                   data[i].status = lvalue.StatusName;
                               }
                           });
                           i++;
                       });
                       $scope.gridOptions.api.setRowData(data);
                       $scope.gridOptions.api.refreshView();
                   });
                };
            }
            else {
                var temp = '';
                vm.filterGrid = function (temp, fromdate, todate) {
                    document.getElementById('myGrid').style.display = "block";
                    var i = 0;
                    var list = Common.GetStatusList();
                    if (fromdate == undefined) {
                        vm.Error = '';
                        vm.Error = 'Please select start date';
                        return false;
                    }
                    if (todate == undefined) {
                        vm.Error = '';
                        vm.Error = 'Please select end date';
                        return false;
                    }
                    vm.Error = '';
                    vm.processing = true;
                    vm.message = '';
                    vm.reportparam = {};
                    vm.reportparam.clientId = vm.user.clientid;
                    vm.reportparam.fromdate = fromdate;
                    vm.reportparam.todate = todate;
                    Image.findClientData(vm.reportparam)
                   .success(function (data) {
                       vm.processing = false;
                       vm.images = data;
                       document.getElementById('hiddenID').value = data.length;
                       allOfTheData = data;
                       createNewDatasource();
                       //show status according to it's value
                       angular.forEach(data, function (value, key) {
                           angular.forEach(list, function (lvalue, key) {
                               if (lvalue.Statusvalue == value.status) {
                                   data[i].status = lvalue.StatusName;
                               }
                           });
                           i++;
                       });
                       $scope.gridOptions.api.setRowData(data);
                       $scope.gridOptions.api.refreshView();
                   });
                };
            }
        });

});





