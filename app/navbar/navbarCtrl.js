app.controller("navbarCtrl", function($scope, userParseSrv, $location, $uibModal) {
    
    $scope.isUserLoggedIn = function() {
        return userParseSrv.isLoggedIn();
    };

    $scope.isAdvancedUser=function(){
      var user = userParseSrv.getActiveUser();
      return user.role?(user.role>0 && user.role<3):false;
    };
    
    $scope.logout = function() {
        userParseSrv.logout();
        $location.path("/");
    };
    
    $scope.open = function(size, parentSelector) {
        var parentElem = parentSelector ? 
        angular.element($document[0].querySelector('.loginModal ' + parentSelector)) : undefined;
        var modalInstance =  $uibModal.open({
          templateUrl: "app/login/login.html",
          controller: "loginCtrl",
          appendTo: parentElem,
          size: '',
        });
        
        modalInstance.result.then(function(response){
            $scope.result = response; //`${response} button hitted`;
        });
        
      };
});

app.controller('ModalContentCtrl', function($scope,$uibModal, $uibModalInstance) {
    //var $ctrl = this;
    $scope.ok = function(){
      $uibModalInstance.close("Ok");
    };
     
    $scope.cancel = function(){
      $uibModalInstance.dismiss();
    };
    
  });