//import moment = require("moment");

app.controller("currentuserCtrl", function ($scope, hotelsSrv, userSrv,$location, $log, $routeParams, hotelParamSrv) {
    $scope.hotelParam = {};
    $scope.hotelParam.hotelId = "";
    var id = $routeParams.id;
    if (id !== 'undefined') {
        $scope.userId = id;
    }
    $scope.activeUser = userSrv.getActiveUser();
    $scope.activeUser=$scope.activeUser?$scope.activeUser:"undefine";
    var hotelsList = [];
    var hotelsByUserIdList = [];
    $scope.months = moment.months();
    
    $scope.hotelParam.month = moment().format("MMMM","en");
    $scope.hotelParam.year = moment().format("YYYY","en");

    hotelsSrv.getHotelsByUser($scope.userId).then(function (hotelsByUserId) {
        hotelsByUserIdList = hotelsByUserId;
        hotelsSrv.getHotels().then(function (hotels) {
            hotelsList = hotels;
            $scope.hotels = [];
            $scope.hotels = hotelsList.filter(function(el) {
                for (var i = 0; i < hotelsByUserIdList.length; i++) {
                    if (hotelsByUserId[i].hotelId === el.id)
                        return true;
                }

            });
        }, function(err) {
            $log.error(err);
        });

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