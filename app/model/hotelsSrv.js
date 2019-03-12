app.factory("hotelsSrv", function ($http, $q, $log, userSrv) {
    function Hotel(hotel) {
        this.id = hotel.id;
        this.name = hotel.name;
    }

    function UserHotel(hoteluser) {
        this.hotelId = hoteluser.hotelId;
        this.userId = hoteluser.userId;
    }

    var hotelsbyId = {};
    var hotels = [];
    function getHotelsByUser(id) {
        var async = $q.defer();
        if (hotelsbyId[id]) {
            async.resolve(hotelsbyId[id])
        } else {
            $http.get("app/model/data/HotelsUsers.json").then((response) => {
                hotelsbyId[id] = [];
                var jesonData = response.data;
                for (var i = 0; i < jesonData.length; i++) {
                    if (jesonData[i].userId == id) {
                        hotelsbyId[id].push(new UserHotel(jesonData[i]))
                    }
                }
                async.resolve(hotelsbyId[id])
            }, (error) => {
                $log.error("Error with HotelsUsers: " + error);
                async.reject(error);
            });
        }

        return async.promise;
    }

    function getHotels() {
        var async = $q.defer();
        $http.get("app/model/data/hotels.json").then((response) => {
            jesonData = response.data;
            for (var i = 0; i < jesonData.length; i++) {
                hotels.push(new Hotel(jesonData[i]))
            }
            async.resolve(hotels);
        }, (error) => {
            $log.error("Error with HotelsUsers: " + error);
            async.reject(error);
        });
        // async.resolve(hotels.filter((hotel) => {
        //     return hu.map((huItem) => { huItem.hotelId === hotel.Id && huItem.userId === id })
       return async.promise;
    }
    function getBillingInfoByHotelId()

    return {
        getHotelsByUser: getHotelsByUser,
        getHotels: getHotels,
        getBillingInfoByHotelId: getBillingInfoByHotelId

    }
});