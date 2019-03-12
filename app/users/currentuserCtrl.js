//import moment = require("moment");

app.controller("currentuserCtrl",function($scope, hotelsSrv, $location, $log, $routeParams){
    $scope.selectedhotelId = "";
    var id = $routeParams["id"];
    if(id!=='undefined'){
        $scope.userId=id;
    }
    var hotelsList = [];
    var hotelsByUserId = [];
    $scope.months = moment.months()
    // $scope.isCurrentMonth(month)
    // {
    //     var now =moment();
    //     if (now.month() === month)
    //         return true;
    //     return false;    
    // }


    hotelsSrv.getHotelsByUser($scope.userId).then(function(hotelsByUserId){
        hotelsByUserId = hotelsByUserId;
        hotelsSrv.getHotels().then(function(hotels){
            hotelsList = hotels;
            $scope.hotels = hotelsList.filter((el)=>{
                   for (var i=0;i<hotelsByUserId.length; i++)
                   {
                       if (hotelsByUserId[i].hotelId === el.id )
                        return true;
                   }
                // return hotelsByUserId.map((hbuEl)=>{hbuEl.hotelId === el.hotelId 
                //     && hbuEl.userId ===$scope.userId});    
            // for (var i=0;i<hotelsList.length;i++)
            // {
            //     for (var j=0; j<hotelsByUserId.length;j++)
            //     {
            //         if (hotelsByUserId[j].hotelId === hotelsList[i].id && hotelsByUserId.userId === $scope.userId){
            //             $scope.hotels.push(hotelsList[i])
            //         }
            //     }
            // }
        },(err)=>{
            $log(err);
        });
        
        
    },(err)=>{
        $log(err);
    });
    
    
    })
});