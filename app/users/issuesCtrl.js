app.controller("issuesCtrl",function($scope, $log, hotelsParseSrv, hotelParamSrv, $uibModal, $document){
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
                needSave();
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
                    needSave();
                }
            }, function (err) {
                $log.error(err);
            });
        });
        
    };

    $scope.deleteIssue=function(issue){
        //if ($scope.result==="Ok"){
            console.log('Warning remove Remove Ok'+ issue.id);
            hotelsParseSrv.deleteIssue(issue).then(function(result){
                if (result.id === issue.id) {
                    var index = $scope.issuesList.findIndex((el)=> el.id === result.id);
                    $scope.issuesList.splice(index,1);
                    //$scope.issuesList=[];
                }
            }, function (err) {
                $log.error(err);
            });
        //}
        $scope.result ="";
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
    
    // $scope.openModal = function (size, issue, parentSelector)
    // {
    //     var modalScope = $scope.$new();
    //     modalScope.issue4delete = issue;
    //     var modalInstance =  $uibModal.open({
    //       templateUrl: "app/users/modal.html",
    //       controller: "issuesCtrl",//"ModalContentCtrl",
    //       scope: modalScope,
    // //      appendTo: parentElem,
    //       size: size,
    //     });
        
    //     modalInstance.result.then(function(response){
    //         modalScope.result = response; //`${response} button hitted`;
    //     }, null);
    //     modalScope.modalInstance = modalInstance;
    //     modalScope.issuesList=$scope.issuesList;
    // };

    $scope.open = function(size,issue,parentSelector) {
        $scope.Issue4delete = issue;
        var parentElem = parentSelector ? 
        angular.element($document[0].querySelector( parentSelector)) : undefined;
        var modalInstance =  $uibModal.open({
          templateUrl: "app/users/modal.html",
          controller: "ModalContentCtrl",
          appendTo: parentElem,
          size: size,
        });
        
        modalInstance.result.then(function(response){
            $scope.result = response; //`${response} button hitted`;
            if ($scope.result==="Ok"){
                $scope.deleteIssue(issue||$scope.Issue4delete);
                
            } 
        },function(){
            $log.info('1modal-component dismissed at: ' + new Date());
            
        },function(){
            $log.info('2modal-component dismissed at: ' + new Date());
        });
        
      };
    // $scope.cancel = function () {
    //     $scope.modalInstance.dismiss('cancel');
    // };
    // $scope.ok = function (issue) {
    //     $scope.modalInstance.close('Ok');
    //     $scope.deleteIssue(issue||$scope.issue4delete);
    // };
    //   $scope.ok = function(){
    //     $uibModalInstance.close("Ok");
    //   };
       
    //   $scope.cancel = function(){
    //     $uibModalInstance.dismiss();
    //   };
  
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