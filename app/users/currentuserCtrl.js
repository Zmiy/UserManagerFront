//import moment = require("moment");

app.controller("currentuserCtrl", function ($scope, hotelsSrv, $location, $log, $routeParams) {
    $scope.selectedhotelId = "";
    var id = $routeParams["id"];
    if (id !== 'undefined') {
        $scope.userId = id;
    }
    var hotelsList = [];
    var hotelsByUserIdList = [];
    $scope.months = moment.months()

    hotelsSrv.getHotelsByUser($scope.userId).then(function (hotelsByUserId) {
        hotelsByUserIdList = hotelsByUserId;
        hotelsSrv.getHotels().then(function (hotels) {
            hotelsList = hotels;
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
        hotelsSrv.getBillingInfoByHotelId(parseInt($scope.selectedHotelId), $scope.selectedYear, $scope.selectedMonth).then(function(billingInfo){
            $scope.billingInfo = billingInfo;
        },function (err){
         $log.error(err)
        });
    }

    // $scope.getDogPicture=function(dog){
    //     dogsServices.getDogPicture(dog).then(function(picUrl){
    //          dog.image=picUrl;
    //     },function(err){
    //      $log.error(err)
    //     })
    //} 
 
});