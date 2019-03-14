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
            $scope.hotels = hotelsList.filter((el) => {
                for (var i = 0; i < hotelsByUserIdList.length; i++) {
                    if (hotelsByUserId[i].hotelId === el.id)
                        return true;
                }

            });
        }, (err) => {
            $log.error(err);
        });

    }, (err) => {
        $log.error(err);
    });
    
    $scope.billingInfo = [];

    $scope.showBills = function(){
        hotelsSrv.getBillingInfoByHotelId(parseInt($scope.hotelParam.hotelId), $scope.hotelParam.year, $scope.hotelParam.month).then(function(billingInfo){
            $scope.billingInfo = billingInfo;
        },function (err){
         $log.error(err);
        });
    };
    $scope.add=function(){
        var newDate = $scope.billingInfo[$scope.billingInfo.length-1].billdate.clone().add(1,"d");
        $scope.billingInfo.push(
                {"billdate":newDate,"hotelId":$scope.hotelParam.hotelId,"homibilling":0,"hotelbilling":0, "status":"New"}
            );
        $scope.billingInfo.forEach((el)=>{console.log(el.billdate.format("LLL","he"));});    
        console.log("new date:"+newDate.format("LLL"));
    };

    $scope.changeStatus = function(dayBilling){
        if(dayBilling.status === "")
        {
            dayBilling.status="*";
        }
    };
    
    $scope.needSave =function() {
        return $scope.billingInfo.some((el)=>{return el.status!=="";});
    };

   $scope.OnChange = function(){
      hotelParamSrv.hotelParam=$scope.hotelParam;
   };
});