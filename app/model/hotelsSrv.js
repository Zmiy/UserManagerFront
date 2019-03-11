app=factory("hotelSrv",function($http,$q,$log,userSrv)
{
    function Hotel(hotel)
    {
        this.id=hotel.id;
        this.name = hotel.name;
    }

    function UserHotel(hoteluser)
    {
        this.hotelId = hoteluser.hotelId;
        this.userId = hoteluser.userId;
    }
    var hu = []; 
    var hotels = [];
    function getHotelsByUser(id)
    {
        var async = $q.defer();
        $http.get("app/model/data/HotelUsers.json").then((response) =>{
            for(var i=0;i<response.length;i++)
            {
                if (response[i].userId == id)
                {
                    hu.push(new UserHotel(response[i]))
                }
                if(hu.length>0)
                {
                    $http.get("app/model/data/hotels.json").then((response) =>{
                        for(var i=0;i<response.length;i++)
                        {
                            hotels.push(new Hotel(response[i]))
                            async.reject(error);
                        }
                    },(error)=>{
                        $log.error("Error with HotelsUsers: "+ error);
                    });
                    async.resolve(hotels.filter((hotel)=>{
                        return hu.map((huItem)=>{huItem.hotelId===hotel.Id && huItem.userId === id})
                    })
                    );
                }
            }  
        },(error)=>{
            $log.error("Error with HotelsUsers: "+ error);
            async.reject(error)
        });
        return async.promise;
    } 
});