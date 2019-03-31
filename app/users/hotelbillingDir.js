app.directive("billingsList", function() {
    return {
        templateUrl: "app/users/hotelbilling.html",
        restrcit: "E",
        transclude: 'true',
        scope: {
        needToReload: '=',
        needSave: '=?', 
		currentHotelObj: '&',
		currentMonth: '&',
		currentYear: '&'
        },

        controller: "hoteBillingCtrl",
        link: function(scope, element, attrs) {
            console.log("need to reload "+ scope.needToReload);
            scope.$watch('needToReload', function(val) {
              //this will return the actual object from the object expression!
			   
            if  (scope.needToReload){
                  //scope.needToReload=false;
                  scope.init();
              }
            });
            
         }
        
    };
});