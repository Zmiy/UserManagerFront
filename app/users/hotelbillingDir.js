app.directive("billingsList", function() {
    return {
        templateUrl: "app/users/hotelbilling.html",
        restrcit: "AE",
        scope: {
                needToReload: '='
        },
        controller: "hoteBillingCtrl",
        link: function(scope, element, attrs) {
            scope.$watch('needToReload', function(val) {
              console.log(val);
              //scope.init();
              needToReload=false;
            });
         }
        
    };
});