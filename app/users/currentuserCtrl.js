//import moment = require("moment");

app.controller("currentuserCtrl", function ($scope, hotelsSrv, hotelsParseSrv, userParseSrv,$location, $log, $routeParams, hotelParamSrv) {
    $scope.hotelParam = {};
    $scope.hotelParam.hotelId = "";
    $scope.hotelParam.hotel = {};
    
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
   };
});