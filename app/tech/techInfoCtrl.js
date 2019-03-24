app.controller('techinfoCtrl', function ($scope, $log, $routeParams, hotelsParseSrv, userParseSrv, $document, $uibModal, $window) {
    
    var id = $routeParams.id;
    if (id !== 'undefined') {
        $scope.userId = id;
    }
    //$scope.date = new Date();
    $scope.date = function()
    {
        return new Date();
    };
    
    $scope.activeUser = userParseSrv.getActiveUser();
    
    $scope.hotelsList = [];
    $scope.filterBy = 'NotResolved';
    hotelsParseSrv.getHotels().then(function (result) {
        $scope.hotelsList = result;
    }, function (error) {
        $log.error(`Something happened wrong when receiving list of hotels {error}`);
    });
    
    $scope.changeStatus = function (currentIssue) {
        if (currentIssue.status === "") {
            currentIssue.status = "*";
        }
        needSave();
    };

    $scope.cmbbIsSolved_OnChange = function (issue) {
        if (issue.isSolved) {
            issue.solvedDate = moment();
        } else {
            issue.solvedDate = "";
        }
        $scope.changeStatus(issue);
    };
    $scope.needSave = false;
    needSave = function () {
        $scope.needSave = $scope.issuesList.some(function (el) { return el.status !== ""; });
    };

    $scope.changeStatus = function (currentIssue) {
        if (currentIssue.status === "") {
            currentIssue.status = "*";
        }
        needSave();
    };

    $scope.cmdbHotels_OnChange = function () {
        $scope.issuesList = [];
        hotelsParseSrv.getIssuesByHotelId($scope.hotelParam.hotelObj).then(function
            (issues) {
            $scope.issuesList = issues;
        }, function (err) {
            $log.error(err);
        });
    };
    $scope.add=function(){
        $scope.issuesList.push(hotelsParseSrv.getNewIssues("New"));
        needSave();
    };

    $scope.save=function(){
        var changedIssue = $scope.issuesList.filter(function(el){return el.status === "New";});
        changedIssue.map(function(el){
            hotelsParseSrv.saveNewIssue(el, $scope.hotelParam.hotelObj).then(function (result) {
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
            hotelsParseSrv.updateIssue(el, $scope.hotelParam.hotelObj).then(function (result) {
                if (result.id === el.id) {
                    el.status = "";
                    needSave();
                }
            }, function (err) {
                $log.error(err);
            });
        });
        
    };

    $scope.deleteIssue = function (issue) {
        console.log('Warning remove Remove Ok' + issue.id);
        hotelsParseSrv.deleteIssue(issue).then(function (result) {
            if (result.id === issue.id) {
                var index = $scope.issuesList.findIndex((el) => el.id === result.id);
                $scope.issuesList.splice(index, 1);
                //$scope.issuesList=[];
            }
        }, function (err) {
            $log.error(err);
        });
        //}
        $scope.result = "";
    };

    $scope.filterBySolved=function(issue)
    {
        switch($scope.filterBy)
        {
            case "All":
              return true;
            case "NotResolved":
                if (!issue.isSolved)
                    return true;
                else
                    return false;
            case "Solved":
                if(issue.isSolved)
                    return true;
                else 
                    return false;

        } 
    }

    $scope.printIt = function(){
        var table = document.getElementById('printArea').innerHTML;
        var myWindow = $window.open('', '', 'width=800, height=600');
        myWindow.document.write(table);
        myWindow.print();
     };


    $scope.openModalPrintPreview=function(){
        var modalScope = $scope.$new();
        //modalScope.activeUserName = $scope.activeUser.name;
        //modalScope.issues = $scope.issuesList;

        var modalInstance = $uibModal.open({
            // ariaLabelledBy: 'modal-title',
            // ariaDescribedBy: 'modal-body',
            templateUrl: "app/tech/printTemplate.html",
            controller: "ModalContentCtrl",
            size: "lg",
            scope: modalScope
            // resolve: {
            //     aciveUserName: function () {
            //       return $ctrl.aciveUserName;
            //     },
            //     issues: function(){
            //         return $scope.issuesList;
            //     }
            //   }
        });
        modalScope.modalInstance = modalInstance;
        modalInstance.result.then(function (response) {
            $scope.result = response; //`${response} button hitted`;
            $log.info("modal return answer: "+ response);
        }, function () {
            $log.info('1modal-component dismissed at: ' + new Date());

        }, function () {
            $log.info('2modal-component dismissed at: ' + new Date());
        });

    };

    $scope.openModal=function(size, issue, parentSelector)
    {
        open(size, issue, parentSelector);    
    };

    var open = function (size, issue, parentSelector) {
        $scope.Issue4delete = issue;
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector(parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            templateUrl: "app/users/modal.html",
            controller: "ModalContentCtrl",
            appendTo: parentElem,
            size: size,
        });

        modalInstance.result.then(function (response) {
            $scope.result = response; //`${response} button hitted`;
            if ($scope.result === "Ok") {
                $scope.deleteIssue(issue || $scope.Issue4delete);
            }
        }, function () {
            $log.info('1modal-component dismissed at: ' + new Date());

        }, function () {
            $log.info('2modal-component dismissed at: ' + new Date());
        });

    };

});

app.controller('ModalContentCtrl', function ($scope, $uibModal, $uibModalInstance) {
    //var $ctrl = this;
    $scope.ok = function () {
        $uibModalInstance.close("Ok");
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

});