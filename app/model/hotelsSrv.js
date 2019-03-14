app.factory("hotelsSrv", function ($http, $q, $log, userSrv) {
    function Hotel(hotel) {
        this.id = hotel.id;
        this.name = hotel.name;
    }

    function UserHotel(hoteluser) {
        this.hotelId = hoteluser.hotelId;
        this.userId = hoteluser.userId;
    }

    function Billing(parseBilling)
    {
        this.ourside = parseBilling.homibills;
        this.hotelside = parseBilling.hotellbills;
        this.billdate = moment(parseBilling.date);  
        this.status=parseBilling.status?parseBilling.status:"";
    }
    
    function Issues(parseIssues)
    {
        this.date = moment(parseIssues.date);  
        this.roomN = parseIssues.roomN;
        this.issues = parseIssues.issues;
        this.isSolved = parseIssues.isSolved;
        this.techId = parseIssues.techId?parseIssues.techId : "";
        this.solvedDate = moment(parseIssues.date);
        this.status=parseBilling.status?parseBilling.status:"";
    }

    var hotelsbyId = {};
    var hotels = [];
    function getHotelsByUser(id) {
        var async = $q.defer();
        if (hotelsbyId[id]) {
            async.resolve(hotelsbyId[id]);
        } else {
            $http.get("app/model/data/HotelsUsers.json").then((response) => {
                hotelsbyId[id] = [];
                var jesonData = response.data;
                for (var i = 0; i < jesonData.length; i++) {
                    if (jesonData[i].userId == id) {
                        hotelsbyId[id].push(new UserHotel(jesonData[i]));
                    }
                }
                async.resolve(hotelsbyId[id]);
            }, (error) => {
                $log.error("Error with HotelsUsers: " + error);
                async.reject(error);
            });
        }

        return async.promise;
    }

    function getHotels() {
        var async = $q.defer();
        if (hotels.length>0){
            async.resolve(hotels);
        }else{
            $http.get("app/model/data/hotels.json").then((response) => {
                jesonData = response.data;
                hotels = [];
                for (var i = 0; i < jesonData.length; i++) {
                    hotels.push(new Hotel(jesonData[i]));
                }
                async.resolve(hotels);
            }, (error) => {
                $log.error("Error with HotelsUsers: " + error);
                async.reject(error);
            });
        }
        
        // async.resolve(hotels.filter((hotel) => {
        //     return hu.map((huItem) => { huItem.hotelId === hotel.Id && huItem.userId === id })
       return async.promise;
    }
    
    function getBillingInfoByHotelId(hotelId,year,month)
    {
        var async = $q.defer();
        $http.get("app/model/data/billing.json").then((response) => {
            jsonData = response.data;
            var billingInfo = [];
            //var firstDay = moment(year+" "+month, 'YYYY MMM', 'en');
            jsonData.filter((element)=>{ return element.hotelId === hotelId;})
            .forEach((el)=>{billingInfo.push(new Billing(el));});
            //billingInfo.forEach(el=>{console.log(el.date.format("MMMM","en") )})
            async.resolve(billingInfo.filter((el)=>{return el.billdate.format("MMMM","en")===month;}));
        }, (error)=>{
            $log.error("Error with Billing: " + error);
            async.reject(error);
        });
        return async.promise;
    }

    return {
        getHotelsByUser: getHotelsByUser,
        getHotels: getHotels,
        getBillingInfoByHotelId: getBillingInfoByHotelId

    };
});