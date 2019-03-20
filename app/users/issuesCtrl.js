app.controller("issuesCtrl",function($scope, $log, hotelsParseSrv, hotelParamSrv, $uibModal){
    var hotelParam = [];
    $scope.init = function () {
        hotelParam=hotelParamSrv.hotelParam;
        $scope.issuesList = [];
        
        //hotelsSrv.getIssuesByHotelId(parseInt(hotelParam.hotelId), hotelParam.year, hotelParam.month).then(function
        hotelsParseSrv.getIssuesByHotelId(hotelParam.hotelObj, hotelParam.year, hotelParam.month).then(function
        (issues){
            $scope.issuesList=issues;
        },function(err){
            $log.error(err);
        }); 
    };
       
    
    $scope.needSave=false;

    needSave =function() {
        $scope.needSave = $scope.issuesList.some(function(el){return el.status!=="";});
    };

    $scope.add=function(){
        //var newDate = $scope.billingInfo[$scope.billingInfo.length-1].billdate.clone().add(1,"d");
        $scope.issuesList.push(hotelsParseSrv.getNewIssues("New"));
        needSave();
        //$scope.billingInfo.forEach(function(el){console.log(el.billdate.format("LLL","he"));});    
        //console.log("new date:"+ newDate.format("LLL"));
    };

    $scope.save=function(){
        var changedIssue = $scope.issuesList.filter(function(el){return el.status === "New";});
        changedIssue.map(function(el){
            hotelsParseSrv.saveNewIssue(el, hotelParam.hotelObj).then(function (result) {
                el.id = result.id;
                el.status = "";
            }, function (err) {
                $log.error(err);
            });
        });
        changedIssue = [];
        changedIssues = $scope.issuesList.filter(function(el){return el.status ==="*";});
        changedIssues.map(function(el){
            hotelsParseSrv.updateIssue(el, hotelParam.hotelObj).then(function (result) {
                if (result.id === el.id) {
                    el.status = "";
                }
            }, function (err) {
                $log.error(err);
            });
        });
        needSave();
    };

    $scope.deleteIssue=function(issue){
        $scope.open("sm");
        if ($scope.result==="Ok"){
            console.log('Warning remove Remove Ok'+ issue.id);
        }
        
    };

    $scope.$on('pleaseRestart', function (event, data) {
        $log.info("received refresh request ");
        $scope.init();
    });

    $scope.changeStatus = function (currentIssue) {
        if (currentIssue.status === "") {
            currentIssue.status = "*";
        }
        needSave();
    };
    $scope.open = function(size,parentSelector) {
        var parentElem = parentSelector ? 
        angular.element($document[0].querySelector('.loginModal ' + parentSelector)) : undefined;
        var modalInstance =  $uibModal.open({
          templateUrl: "warningModalContent.html",
          controller: "ModalContentCtrl",
          appendTo: parentElem,
          size: size,
        });
        
        modalInstance.result.then(function(response){
            $scope.result = response; //`${response} button hitted`;
        });
        
      };
    $scope.init();
});

app.controller('ModalContentCtrl', function($scope,$uibModal, $uibModalInstance) {
    //var $ctrl = this;
    $scope.ok = function(){
      $uibModalInstance.close("Ok");
    };
     
    $scope.cancel = function(){
      $uibModalInstance.dismiss();
    };
    
  });