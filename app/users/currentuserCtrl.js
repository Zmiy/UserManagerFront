//import moment = require("moment");

app.controller("currentuserCtrl", function ($scope, hotelsParseSrv, userParseSrv,$log, $routeParams, hotelParamSrv, $document, $uibModal) {
//   if (!userParseSrv.isLoggedIn()) {
//     $location.path("/");
//     return;
// }

  $scope.hotelParam = {};
    $scope.hotelParam.hotelId = "";
    $scope.hotelParam.hotel = {};
    $scope.Refresh={"refreshBilling":false, "refreshIssues": false};
    $scope.status = [{"open":false, "needSave": false},{"open":false, "needSave": false}];
    
    var openOkCancelModal = function() {
      
      var modalInstance =  $uibModal.open({
        templateUrl: "ModalOkCancel.html",
        controller: "ModalContentCtrl_CU",
        size: 'sm',
        windowClass: 'modal-dialog'
      });
      
      modalInstance.result.then(function(response){
          $scope.result = response; //`${response} button hitted`;
          if ($scope.result==="Cancel"){
            preventCloseGroup();
          }else{
            closeGroup();
        
          } 

      },function(){
          $log.info('1modal-component dismissed at: ' + new Date());
          
      },function(){
          $log.info('2modal-component dismissed at: ' + new Date());
      });
      
    };
     
    $scope.checkBeforeCloseUiGroup = function()
    {
      if ($scope.status[0].open && $scope.status[0].needSave){
        openOkCancelModal();
        event.preventDefault();
        event.stopPropagation();
      }
      
    };

    closeGroup = function()
    {
      $scope.status[0].open = false;
      // var id = "billing";
      // var elements = angular.element($document[0].querySelector('#'+id));
      // var children = elements.children();
      // for (i=0;i<children.length; i++)
      // {
      //   child = angular.element(children[i]);
       
      //       child.addClass('in');
      //       child.removeClass('collapse');
      //       child.css('height','auto');
      // }
    };

    var preventCloseGroup = function(){
      var id = "billing";
      var elements = angular.element($document[0].querySelector('#'+id));
      var children = elements.children();
      for (i=0;i<children.length; i++){
        child = angular.element(children[i]);
        if (child.hasClass('card-collaps')){
          if(child.hasClass("in")){
            child.removeClass('in');
            child.addClass('collapse');
            child.css('height','0px');
          }else{
            child.addClass('in');
            child.removeClass('collapse');
            child.css('height','auto');
          }
        }
      }
    };

    $scope.foo = function() {
      
      if ($scope.status[0].open && $scope.status[0].needSave)
      {
        alert("needSave");
        event.preventDefault();
        event.stopPropagation();
 
        var id = "billing";
        var elements = angular.element($document[0].querySelector('#'+id));
        var children = elements.children();
        for (i=0;i<children.length; i++){
          child = angular.element(children[i]);
          if (child.hasClass('card-collaps')){
            if(child.hasClass("in")){
              child.removeClass('in');
              child.addClass('collapse');
              child.css('height','0px');
            }else{
              child.addClass('in');
              child.removeClass('collapse');
              child.css('height','auto');
            }

          }
          
        }

      }
    };

    var id = $routeParams.id;
    if (id !== 'undefined') {
        $scope.userId = id;
    }
    $scope.activeUser = userParseSrv.getActiveUser();
    $scope.activeUser=$scope.activeUser?$scope.activeUser:"undefine";
    var hotelsList = [];
    var hotelsByUserIdList = [];
    $scope.months = moment.months();
    
    $scope.hotelParam.month = moment().get('month'); //moment().format("MMMM","en");
    $scope.hotelParam.year = moment().get('year'); //moment().format("YYYY","en");

    hotelsParseSrv.getHotelsByUser($scope.userId).then(function (hotelsByUserId) {
        $scope.hotels = [];
        $scope.hotels = hotelsByUserId;
        
    }, function(err)  {
        $log.error(err);
    });
    
   $scope.MytoggleOpen=function()   
   {
       console.log("Try to a litle change accordion group directive");
       toggleOpen();
   };

   $scope.OnChange = function(){
      hotelParamSrv.hotelParam=$scope.hotelParam;
      if ($scope.status[0].open){
        $scope.Refresh.refreshBilling = true;
      }
      // $scope.$broadcast('pleaseRestart', {
      //   needRestart: true
      // });

   };
   $scope.oneAtATime = true;

  //  $scope.status = {
  //   isCustomHeaderOpen: false,
  //   // isFirstOpen: true,
  //   isFirstDisabled: false
  // };
  $scope.userVal = 0;
  
  $scope.selection = function(index){
    $scope.userVal = index;
  };
  
  $scope.check = function(index){
    return $scope.userVal == index ;
  };
});

app.controller('ModalContentCtrl_CU', function($scope,$uibModal, $uibModalInstance) {
  //var $ctrl = this;
  $scope.ok = function(){
    $uibModalInstance.close("Ok");
  };
   
  $scope.cancel = function(){
    $uibModalInstance.close("Cancel");
    $uibModalInstance.dismiss();
  };
  
});