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
.controller('imageCreateController', function (Image, $location) {
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
			    $location.path('/dashboard');
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
              $scope.stepsModel.push(e.target.result);

              $scope.image.imageData.file = e.target.result;

          });
      }

      $scope.excelIsLoaded = function (e) {
          $scope.$apply(function () {
              $scope.stepsModel.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAACjCAMAAAA3vsLfAAAAkFBMVEUCcjv///8AcDg8j2MAai3U6N8AaCnD28+awKwAZSUAYyEAbjSszLvy+faLtJw2g1cugFGQuqI/imC91slWmHI8il/m8OtOkmx9rZL5/fsAYhzr9PBto4TL39Rknn3c6uO00sKkxbMXd0MAVgAhfEtnoYB1qo0AYRNcnXkAXQaDtJoaeUeUuaRSlXCLuqJ6r5N9jWLGAAAKQ0lEQVR4nO2da2OaPBTHMU+IQlRQ6wUQReacs3X7/t/uITcEuVhT4mx7/i+2GiGEnyfJyUkClgW6W+i/f12CTynApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiXApiWT2CjF5jL/tzKDDVHiEjRfn74qt66xIYodl+43k8QOer2t223uT6MOsTFgTnoeD+1RT8oGbG2ZZHUypNPDMI56JQG2htMpdl3i/xz0F70aAbbKiRQTh+6Pk9m2Dhhgq5ySASN0vxwnl0YMsLUdLIH9Hca1dRKwXR+Wua6Evk7Xg3gbvIvYN8fGgeEM2Ft/e6tOAjb+HQNmzTfjZBvdRtSADb1bj7vpj6sFG9pvTkN7cUedrMGG9v47lX6mgVgLNjL4ADCFzUmC0fsUrT4RN+PY+u8/+hNxM45t9v6j+84Db/xjAmxaAmxaAmxaAmxaAmxaeiYHBLABto9hQ/5cyTtmKfF+XpY/BGxVbCyCojRnaMJCApNzuQpgu2C7iE4ZmutQEgZsgM0CbG0CbFoCbFoCbFoCbFoyjg07SqGfpcx+OGX9ngC2Kjb8Z5YosXFWlFzrshbi22EbLey4n8Q12D7rmJSPZVq+1sFWmgOMKCXEcd3wh/11sCH/5Xx+SZu/vwNbMPj78zz1U/prWEidyJvF6yoII9geMTON31iBpo0Z32VthzCz3KyQvE9UsmTepGbBFpte9vIJ5JcsJU698qzyfveM1obHrEBeN9gWqrbjS31MpEdRZ2zlxQwqAlIWudMBwX+q89VB50urO8XWW8vi4VWe5EmUpNqyGfHb8KTmOuPnxmYTedZeLT6yQ3mdTc3dADaps7ItNbPyUybgOmMziK28oGfy5NhieWf0KD5H0vzqjc0ctvWyqLPfdV/aMbbeXFoXFatQJwpb1dU1im2KS5H1zj2QrrHN5G0T7tgEqciY1hubQWwtHnwX6hpb71WC8ljrkrQbG2DLNVTm1r+Unp7rqfEIiKskIyBuWfdGQD4ptp5sSJh7a98wNhEBySUiILMr3RkB+Qg2RDFT5VyeXGogu8c2EKyQFSnvt9HYTIxJm7BRZrqklORkKc7lznFoLQ/j8fgwpS4tnkiXq/F4dbbCS2r32EbSR3KGgWznSJOxPRAb/mvHcZwUW063n6XEe3nrmKxy1zLov6jzUTidKR8wPoeKU/fYemPxm9J1LP9YNoJ4oLVhvgdgffF7CT9Q1Y1wVXaQVc9mlVZE9S3lvXePTbq4yP8rrkGaydgu8qa5mJcSFz5zeXeuAWmspPzHi3JsKGWf5T5giq4qhPSc8Pxqw8ViT01h6x1KQ5lSFKmCrfM1II1dQsj5K//bCrkZCe+cpnKL2Hb4NhnMIoVNeFFZ8m7yNhSHbEXwzgS2banlbauGD/XbMAsvjGRbRl84RJ4joqJVm3mhQwhxyTHmlRQhjmpxdLNkJ9zw8MSO35wJbL1NsSNqMTZz2DwHFyRdIj5USUQmhBGRVZTsePbrvKek7vqVpXP7jJGsPMRn3AIeCTOCLS7cn9vW5hvDtrUL2sp+MeRFWbIPRNw2za+b/dbF3JmTRj2ek5XbAP7JEngnYgRbHj/Krj1vofaoeNtaFAelrKli/buIB8pZDhHkGlQ2GzoJv5VCQ42Z6701Zm29Yd661UYNH40tD/rxoHPmhLiMlOpFebu/qDaGNLi+Js+b11LT1oasth2Aj7I2ZTHc8d5SzPsDGeMSLKuzDSJqsy6mi35kYwpb8f5aJ6HL2ObdYZusispvT1jWKWSVTU1E8joa7CsEeIcwskiha3F8RdgItmXB4kWD0oyNGImAeKTak/Iys28X7J+tMiMeULWrUfOQeSWj07goMbAwhE1ajJof3bVhw5OrCMh1AKTbCAiiKjt1BHplA4EZqRzqNj0lgTXcJrCJRgPtVbmaze2BY1IpNUB+U5yQxzrVXRUbadr5bwjbTMzx4ZOc628xNwObh27F28SgapQvcKBT9qsOqpW0EVtiBpucUHZi5S7tG80tw9YYVDKDTVnbUOUlsDVZ22J1utJ4fDTSk0pjy+pmX5al2dxKu2DmfBeM/8FdMLfaNtViKR8J8SFTTdsW8uHXL1yRGXdXzkmyPkv+2WxutyMgqLMIiCgV+xFi5v5HMsiNUtYlNPWkUQOYzrFJY+P9+uCWuT165grzWe8l/xnzNT0MjwpEF8THVkFTRl1j8y8zMNlvJX9Rv6F5fTA2ZLFyDB0xiXvEhduoPvUBH1j6uFp7+ZeGppfFZJUKWDaZ24Ox8aFolCLh4o6EGyw6iUUFmwz/1q8e6RqbigKKDitfgdRgbo/FJpbYsZ9SVNZEeko8SFmOgLC7cHj6qXxRaiQonqiBXiI+q+I3mNtDsV3iRtLuZDWVy3pW+bSUhYhvqbF8cC5UU0o2YvFSx9h86aop61IYG8zNILbq4t2QtRuBGsIwhLLtlavKBoiw3hVRQk9bNpcgJiqDlZhaZg/C8hIZE+sWm1rzQfLxd/vI1FgEJFqUFGWet8PvdKCqwx9eXn41JGdgFpNlSunr8m3Ri1i5qS8cJ3s1zdLT6aof9IxgkwMEZOXD4Elr62ZgF0x9XPSARYh7kS9JECuwN7zKUV+VdxRFvJwcm2wCMwWjRTQSDA1gyxcYXZY3j6QbZzm7Wmz4NMzF2sPFbnilyzLMD2ETmI55xyjnTUVtoOlVRGEk0vH5+sF0IzG91Ck2tby5uOJ0kw9iaoYKJiIgtd7kSsySzgpNgMt7rb7giMimuP7fVqXG6a5Y7GggnyIn9iV0g20Xsl0JqLx6wW4zNwMREOS91MhHR/ZfWrzPlCUd1SeKp7t4MRpF2/5kfll0hEi6mm0jnj5YUhXxRD7PrrkUd2AbrI9Lb2/h3yUUygTrRqYGIiDW1ay+WoVaXYwqDrx8poRghNi/Je8Fsae7VtIN7Lkq40l+8S1XrvO7ZkH+0z0HpKna3bn6t4sdfkG0tfuzZFeH7eYuGHgOSFWwexmwFQXYtATYtATYtATYtATYtGT+OSBEyRUREFLWL3gOSA22ziMgzyF4NqWW4AGyWgJsWgJsWgJsWgJsWgJsWgJsWnomv23ZErx/MpkfJSTXw4Imnbt+dIxBPXBMekufx9YeGgH5Smp7q5p3GPQXd7+377tjExOv/nK1i3XfSPctsYkD2DtJLf9lNbTvf//h98UmjuIvj0y943h28w24gO36WPXmzUH/ne92BWyXM/h7XtP5YVf/dm/A1nYepcTB1nQ1jFtqLWCrP5tixyXW+ZTYtbUWsLXlQbHrkv1mMLt2VADb7ZwocUPqlZo8wPbe/DBxScpc5CjInynx9dQ1NpEpa/Lw/jju/Hm4zyIj2GTWmaNiLPN/LIPYvrIAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5YAm5bQf/8DGvLjwXM3c1sAAAAASUVORK5CYII=");

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
                $location.path('/dashboard');
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
        { headerName: "total", field: "total", width: 120, hide: true },
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
                    debugger
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
            allColumns:true
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
                        vm.Error = 'Please select from date';
                        return false;
                    }
                    if (todate == undefined) {
                        vm.Error = '';
                        vm.Error = 'Please select to date';
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
                    var i = 0;
                    var list = Common.GetStatusList();
                    if (fromdate == undefined) {
                        vm.Error = '';
                        vm.Error = 'Please select from date';
                        return false;
                    }
                    if (todate == undefined) {
                        vm.Error = '';
                        vm.Error = 'Please select to date';
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





