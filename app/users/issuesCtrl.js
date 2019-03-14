app.controller("issuesCtrl",function($scope, hotelsSrv, hotelParamSrv){
    var hotelParam = hotelParamSrv.hotelParam;
    $scope.issuesList = [];
    hotelSrv.getIssuesByHotelId(parseInt(issuesParam.hotelId), isuesParam.year, issuesParam.month).then(function(issues){
        $scope.issuesList=issues;
    },function(err){
        $log.error(err);
    });    
});