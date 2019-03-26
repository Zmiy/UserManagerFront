app.directive("billingsList", function() {
    return {
        templateUrl: "app/users/hotelbilling.html",
        restrcit: "E",
        transclude: 'true',
        scope: {
        needToReload: '=',
		currentHotelObj: '&',
		currentMonth: '&',
		currentYear: '&'
        },

        controller: "hoteBillingCtrl",
        link: function(scope, element, attrs) {
            console.log("need to reload "+ scope.needToReload);
            scope.$watch('needToReload', function(val) {
              //this will return the actual object from the object expression!
			              
            console.log("Watch:",attrs.needToReload+" " +attrs.currentMonth, val, scope.needToReload);
              
            if  (scope.needToReload){
                  //scope.needToReload=false;
                  scope.init();
              }
            });
            attrs.$observe('needToReload',function(newVal, oldVal){
                console.log("observe: "+newVal+" "+ oldVal);
            });
         }
        
    };
});