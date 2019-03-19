app.controller("hoteBillingCtrl", function ($scope, hotelsSrv, hotelsParseSrv, userSrv, $log, $route, hotelParamSrv) {
    $scope.init=function()
    {
        var hotelParam = hotelParamSrv.hotelParam;
        $scope.billingInfo = [];
        
        $scope.needToReload = false;
        //hotelsSrv.getBillingInfoByHotelId(parseInt(hotelParam.hotelId), hotelParam.year, hotelParam.month).then
        hotelsParseSrv.getBillingInfoByHotelId(hotelParam.hotelObj, hotelParam.year, hotelParam.month).then
        (function (billingInfo) {
            $scope.billingInfo = billingInfo;
        }, function (err) {
            $log.error(err);
        });
    
        
    };

    $scope.add = function () {
        var newDate = $scope.billingInfo[$scope.billingInfo.length - 1].billdate.clone().add(1, "d").format("YYYY-MM-DD");
        $scope.billingInfo.push(hotelsParseSrv.getNewBilling(newDate,"New"));
        // $scope.billingInfo.push(
        //     { "billdate": newDate, "hotelId": $scope.hotelParam.hotelId, "homibilling": 0, "hotelbilling": 0, "status": "New" }
        // );
        //$scope.billingInfo.forEach(function (el) { console.log(el.billdate.format("LLL", "he")); });
        //console.log("new date:" + newDate.format("LLL"));
    };

    $scope.save = function(){
        var newBill = $scope.billingInfo.filter(function(el){return el.status==="New";});
        
        newBill.forEach(function(el){
            hotelsParseSrv.saveNewBilling(el,hotelParam.hotelObj).then(function(result){
                el.id=result.id;
                el.status="";
            },function(err){
                $log.error(err);
            });
            
        });
        var updateBill = $scope.billingInfo.filter(function(el){return el.status==="*";});
        updateBill.forEach(function(el){
            var result = hotelsParseSrv.updateBilling(el,hotelParam.hotelObj);
            if (result)
            {
                el.status="";
            }
        });
        // $scope.saved = true;
        // $scope.reloadOn = true;
    };
    
    $scope.changeStatus = function (dayBilling) {
        if (dayBilling.status === "") {
            dayBilling.status = "*";
        }
    };

    
    // $scope.$watch ($scope.$parent.status.billingOpen, function(){
    //     console.log($scope.$parent.status.billingOpen);
    // });

    
    $scope.$watch('needToReload', function(newVal, oldVal) {
        //  all directive code here
       // $log.info("value of needReload changed!!!");
        if (newVal){
            $scope.needToReload=false;           
            $scope.init(); 
          
            console.log("Reloaded successfully......" + $scope.reloadOn);
        }
        //console.log("Reloaded successfully......" + $scope.reloadOn);
    });      

    $scope.OnChange = function () {
        hotelParamSrv.hotelParam = $scope.hotelParam;
    };
    // $scope.$on('pleaseRestart', function (event, data) {
    //     $log.info("received refresh request "+data.needRestart);
    //     $scope.needReload = true;     
    //   });

    $scope.needSave = function () {
        hotelParamSrv.needSave = $scope.billingInfo.some(function (el) { return el.status !== ""; });
        return hotelParamSrv.needSave; //$scope.billingInfo.some(function (el) { return el.status !== ""; });

    };    

   $scope.init(); 
});