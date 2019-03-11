app.controller("loginCtrl", function($scope, $location, userSrv) {

    $scope.invalidLogin = false;
//    $scope.email = "nir@nir.com";
//    $scope.pwd = "123";



    $scope.login = function() {

        userSrv.login($scope.email, $scope.pwd).then(function(activeUser) {
            if (activeUser.role === 3)
            {
                $location.path("currentuser/"+ activeUser.id)
            }
            //$location.path("/user/"+ activeUser.role);
        }, function() {
            $scope.invalidLogin = true;
        });

    }

})