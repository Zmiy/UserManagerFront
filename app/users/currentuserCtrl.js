//import moment = require("moment");

app.controller("currentuserCtrl", function ($scope, hotelsSrv, hotelsParseSrv, userParseSrv,$location, $log, $routeParams, hotelParamSrv) {
    $scope.hotelParam = {};
    $scope.hotelParam.hotelId = "";
    $scope.hotelParam.hotel = {};
    $scope.Refresh={"refreshBilling":false, "refreshIssues": false};
    $scope.status = [{"open":false},{"open":false}]

     /**
         * Close panel method
         * @param idx {Number} - Array index
         */
        $scope.closePanel = function (idx) {
            if ($scope.groups[idx].open) {
                console.log("Closed group with idx: " + idx);
                $scope.groups[idx].open = false;
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
    
    $scope.hotelParam.month = moment().get('month');//moment().format("MMMM","en");
    $scope.hotelParam.year = moment().get('year');//moment().format("YYYY","en");

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
  }
  
  $scope.check = function(index){
    return $scope.userVal == index ;
  }
});