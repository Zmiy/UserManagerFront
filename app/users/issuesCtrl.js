app.controller("issuesCtrl",function($scope, hotelsSrv, hotelParamSrv){
    var hotelParam = hotelParamSrv.hotelParam;
    $scope.issuesList = [];
    $scope.issuesHeader = ["#","room N", "Issue", "isSolved"];
    hotelsSrv.getIssuesByHotelId(parseInt(hotelParam.hotelId), hotelParam.year, hotelParam.month).then(function(issues){
        $scope.issuesList=issues;
    },function(err){
        $log.error(err);
    });    

    $scope.needSave =function() {
        return $scope.issuesList.some(function(el){return el.status!=="";});
    };

    $scope.add=function(){
        //var newDate = $scope.billingInfo[$scope.billingInfo.length-1].billdate.clone().add(1,"d");
        $scope.issuesList.push(hotelsSrv.getNewIssues("new"));
        //$scope.billingInfo.forEach(function(el){console.log(el.billdate.format("LLL","he"));});    
        //console.log("new date:"+ newDate.format("LLL"));
    };
});