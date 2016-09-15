angular.module('mainCtrl', [])

.controller('mainController', function ($rootScope, $location, Auth, $window, $scope, $cookieStore) {
    var vm = this;
    //Get cookie
    $scope.UserNameCookie = $cookieStore.get('CookieUserName');
    $scope.PasswordCookie = $cookieStore.get('CookiePassword');
    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function () {
        vm.loggedIn = Auth.isLoggedIn();
        // get user information on page load
        Auth.getUser()
			.then(function (data) {
			    vm.user = data.data;
			    $window.localStorage.setItem('tempclientId', vm.user.clientid);
			});
    });



    // function to handle login form
    vm.doLogin = function () {
        vm.processing = true;
        // clear the error
        vm.error = '';
        var UserData = { UserName: vm.loginData.username, Password: vm.loginData.password }
        var rememberMe = $scope.rememberMe;
        if (rememberMe == true) {
            $cookieStore.put('CookieUserName', vm.loginData.username);
            $cookieStore.put('CookiePassword', vm.loginData.password);
        }
        else {
            // Removing a cookie
            $cookieStore.remove('CookieUserName');
            $cookieStore.remove('CookiePassword');
        }

        Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function (data) {
			    vm.processing = false;
			    // if a user successfully logs in, redirect to users page
			    if (data.success) {
			        if (data.isdefault)
			            $location.path('/changePassword');
			        else {
			            $location.path('/dashboard');
			        }
			    }
			    else
			        vm.error = data.message;
			});
    };

    /// function to active tab

    $scope.currentId = 1;

    $("#myid li").click(function () {
        $scope.currentId = this.id;
    });

    // function to handle logging out
    vm.doLogout = function () {
        Auth.logout();
        vm.user = {};
        $window.location.reload();
        $location.path('/login');
    };

    vm.createSampleUser = function () {
        Auth.createSampleUser();
    };
})

.controller('forgotpasswordController', function (User, Auth) {
    var vm = this;
    vm.type = 'forgot';
    vm.doforgotPassword = function () {
        Auth.forgotUser(vm.userData.username)
        .success(function (data) {
            vm.processing = false;
            vm.userData = {};
            // if a user successfully logs in, redirect to users page
            //if (data.success)
            //    vm.error = data.message;
            if (data.message != null && data.message != undefined)
                if (data.message == 'User not exist.') {
                    vm.success = "";
                    vm.error = data.message;
                }
                else {
                    vm.error = "";
                    vm.success = data.message;
                }
        });
    };

})
