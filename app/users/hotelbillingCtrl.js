
app.controller("hoteBillingCtrl", function ($scope, hotelsSrv, userSrv, $log, hotelParamSrv) {
    var hotelParam = hotelParamSrv.hotelParam;
    $scope.billingInfo = [];


    hotelsSrv.getBillingInfoByHotelId(parseInt(hotelParam.hotelId), hotelParam.year, hotelParam.month).then(function (billingInfo) {
        $scope.billingInfo = billingInfo;
    }, function (err) {
        $log.error(err);
    });

    $scope.add = function () {
        var newDate = $scope.billingInfo[$scope.billingInfo.length - 1].billdate.clone().add(1, "d").format("YYYY-MM-DD");
        $scope.billingInfo.push(hotelsSrv.getNewBilling(newDate,"New"));
        // $scope.billingInfo.push(
        //     { "billdate": newDate, "hotelId": $scope.hotelParam.hotelId, "homibilling": 0, "hotelbilling": 0, "status": "New" }
        // );
        //$scope.billingInfo.forEach(function (el) { console.log(el.billdate.format("LLL", "he")); });
        //console.log("new date:" + newDate.format("LLL"));
    };

    $scope.changeStatus = function (dayBilling) {
        if (dayBilling.status === "") {
            dayBilling.status = "*";
        }
    };

    $scope.needSave = function () {
        hotelParamSrv.needSave = $scope.billingInfo.some(function (el) { return el.status !== ""; });
        return hotelParamSrv.needSave; //$scope.billingInfo.some(function (el) { return el.status !== ""; });

    };
    $scope.$watch ($scope.$parent.status.billingOpen, function(){
        console.log($scope.$parent.status.billingOpen);
    });
    $scope.OnChange = function () {
        hotelParamSrv.hotelParam = $scope.hotelParam;
    };
});