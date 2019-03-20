app.controller("loginCtrl" , function($scope, $location,  userParseSrv, $uibModalInstance) {
    $scope.invalidLogin = false;
//    $scope.email = "nir@nir.com";
$scope.pwd = "u123";



    $scope.login = function() {
        
        userParseSrv.login($scope.email, $scope.pwd).then(function(activeUser) {
            if (activeUser.role === 3)
            {
                $location.path("currentuser/"+ activeUser.id);
            }
            //$location.path("/user/"+ activeUser.role);
        }, function() {
            $scope.invalidLogin = true;
        });
        //$uibModalInstance.close("Ok");
        //$scope.$parent.$ModalContentCtrl.ok();
        $scope.ok();
    };

    $scope.ok = function(){
      $uibModalInstance.close("Ok");
    };
     
    $scope.cancel = function(){
      $uibModalInstance.dismiss();
    };
});