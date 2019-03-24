app.controller("loginCtrl" , function($scope, $location,  userParseSrv, $uibModalInstance) {
    $scope.invalidLogin = false;
   $scope.email = "yan.stolyarov.bestbar@gmail.com";
$scope.pwd = "t123";



    $scope.login = function() {
        
        userParseSrv.login($scope.email, $scope.pwd).then(function(activeUser) {
            if (activeUser.role === 3)
            {
                $location.path("currentuser/"+ activeUser.id);
            }else if (activeUser.role===2)
            {
                $location.path("currentTech/"+ activeUser.id);
            }

            $scope.ok();
            //$location.path("/user/"+ activeUser.role);
        }, function() {
            $scope.invalidLogin = true;
        });
        
       
    };

    $scope.ok = function(){
      $uibModalInstance.close("Ok");
    };
     
    $scope.cancel = function(){
      $uibModalInstance.dismiss();
    };
});