app.directive("billingsList", function() {
    return {
        templateUrl: "app/users/hotelbilling.html",
        restrcit: "E",
        scope: {
            reloadOn: '='
        },
        controller: "hoteBillingCtrl"
        
    };
});