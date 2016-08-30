angular.module('mainCtrl', [])

.controller('mainController', function ($rootScope, $location,  Auth) {
    var vm = this;

    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function () {
        vm.loggedIn = Auth.isLoggedIn();
        // get user information on page load
        Auth.getUser()
			.then(function (data) {
			    //alert(JSON.stringify(data.data));
			    vm.user = data.data;
			});
    });

    // function to handle login form
    vm.doLogin = function () {
        vm.processing = true;

        // clear the error
        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function (data) {
			    vm.processing = false;
			    debugger;
			    // if a user successfully logs in, redirect to users page
			    if (data.success) {
			        //if (data.isdefault)
			        //    $location.path('/changepassword');
			        //else
			        $location.path('/dashboard');
			    }
			    else
			        vm.error = data.message;
			});
    };

    // function to handle logging out
    vm.doLogout = function () {
        Auth.logout();
        debugger;
        vm.user = '';
        ApplicationCache.UNCACHED();
        $location.path('/login');
    };

    vm.createSampleUser = function () {
        Auth.createSampleUser();
    };
})

.controller('forgotpasswordController', function (User, Auth) {
    debugger;
    var vm = this;

    vm.type = 'forgot';

    vm.doforgotPassword = function () {
        debugger;
        Auth.forgotUser(vm.userData.username)
        .success(function (data) {
            vm.processing = false;

            // if a user successfully logs in, redirect to users page
            if (data.success)
                $location.path('/users');
            else
                vm.error = data.message;

        });
    };

})
