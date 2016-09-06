agGrid.initialiseAgGridWithAngular1(angular);
angular.module('imageCtrl', ['imageService', 'commonService'])
.controller('imageController', function (Image) {
    var vm = this;

    // set a processing variable to show loading things
    vm.processing = true;

    // grab all the clients at page load
    Image.all()
		.success(function (data) {
		    // when all the clients come back, remove the processing variable
		    vm.processing = false;

		    // bind the clients that come back to vm.clients
		    vm.images = data;
		});



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
    vm.saveImage = function (temp) {
        debugger;
        vm.processing = true;
        vm.message = '';
        vm.imageData.clientId = temp;
        // use the create function in the clientService
        Image.create(vm.imageData)
			.success(function (data) {
			    vm.processing = false;
			    vm.imageData = {};
			    $location.path('/images');
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
              $scope.image.imageData.size = file.size;
              $scope.image.imageData.type = file.type;
              debugger;

              var reader = new FileReader();

              reader.onload = file.name.indexOf(".xls") > -1 ? $scope.excelIsLoaded : $scope.imageIsLoaded;
              reader.readAsDataURL(file);
          }
      }

      $scope.imageIsLoaded = function (e) {
          $scope.$apply(function () {
              $scope.stepsModel.push(e.target.result);
              debugger;
              $scope.image.imageData.file = e.target.result;

          });
      }

      $scope.excelIsLoaded = function (e) {
          $scope.$apply(function () {
              $scope.stepsModel.push(e.target.result);
              debugger;
              $scope.image.imageData.file = e.target.result;
              var workbook = XLSX.readFileSync(e.target.result, { type: 'binary' });

              workbook.SheetNames.forEach(function (sheetName) {
                  // Here is your object
                  var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                  var json_object = JSON.stringify(XL_row_object);
                  console.log(json_object);

              })

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

                $location.path('/images');
            });
    };

})

.controller('reportController', function ($scope, Image) {
    var vm = this;

    // set a processing variable to show loading things
    vm.processing = true;

    var columnDefs = [
        { headerName: "Name", field: "name" },
        { headerName: "File Name", field: "filename" },
        { headerName: "Size", field: "size" },
        { headerName: "Type", field: "type" },
        { headerName :"Uploaded On",field:"uploadedOn"},
        { headerName: "Status", field: "status" }

    ];
    //Ag grid setting
    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowSelection: 'multiple',
        enableColResize: true,
        enableSorting: true,
        groupHeaders: true,
        rowHeight: 22,
        showToolPanel:true,
        suppressRowClickSelection: true,
        enableFilter: true
    };

    //get ag grid data
    Image.all()
    	.success(function (data) {
    	    vm.processing = false;
    	    $scope.gridOptions.api.setRowData(data);
    	    $scope.gridOptions.api.refreshView();
    	});

    //for filter
    $scope.onFilterChanged = function (value) {
        $scope.gridOptions.api.setQuickFilter(value);
    }

    //ag-grid export data
    $scope.onBtExport = function () {
        var params = {};
        $scope.gridOptions.api.exportDataAsCsv(params);
    };
});




