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
        this.ourside = parseBilling.homibill;
        this.hotelside = parseBilling.hotelbill;
        this.billdate = moment(parseBilling.date);  
        this.status=parseBilling.status?parseBilling.status:"";
    }
    
    function Issues(parseIssues)
    {
        this.issuesdate = moment(parseIssues.date);  
        this.roomN = parseIssues.roomN;
        this.issues = parseIssues.issues;
        this.isSolved = parseIssues.isSolved;
        this.techId = parseIssues.techId?parseIssues.techId : "";
        this.solvedDate = parseIssues.solvedDate? moment(parseIssues.solvedDate): null;
        this.status= parseIssues.status?parseIssues.status:"";
    }

    var hotelsbyId = {};
    var hotels = [];
    function getHotelsByUser(id) {
        var async = $q.defer();
        if (hotelsbyId[id]) {
            async.resolve(hotelsbyId[id]);
        } else {
            $http.get("app/model/data/HotelsUsers.json").then(function(response) {
                hotelsbyId[id] = [];
                var jesonData = response.data;
                for (var i = 0; i < jesonData.length; i++) {
                    if (jesonData[i].userId == id) {
                        hotelsbyId[id].push(new UserHotel(jesonData[i]));
                    }
                }
                async.resolve(hotelsbyId[id]);
            }, function(error) {
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
            $http.get("app/model/data/hotels.json").then(function(response) {
                jesonData = response.data;
                hotels = [];
                for (var i = 0; i < jesonData.length; i++) {
                    hotels.push(new Hotel(jesonData[i]));
                }
                async.resolve(hotels);
            }, function(error) {
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
        $http.get("app/model/data/billing.json").then(function(response) {
            jsonData = response.data;
            var billingInfo = [];
            //var firstDay = moment(year+" "+month, 'YYYY MMM', 'en');
            jsonData.filter(function(element){ return element.hotelId === hotelId;})
            .forEach(function(el){billingInfo.push(new Billing(el));});
            //billingInfo.forEach(el=>{console.log(el.date.format("MMMM","en") )})
            async.resolve(billingInfo.filter(function(el){return el.billdate.format("MMMM","en")===month;}));
        }, function(error){
            $log.error("Error with Billing: " + error);
            async.reject(error);
        });
        return async.promise;
    }

    function getIssuesByHotelId(hotelId, year, month){
        var async = $q.defer();
        $http.get("app/model/data/issues.json").then(function(response){
        jsonData = response.data;
        var issuesList =[];
        jsonData.filter(function(element){ return element.hotelId === hotelId;})
            .forEach(function(el){issuesList.push(new Issues(el));});
            async.resolve(issuesList.filter(function(el){return !el.isSolved;}));
        },function(err){
            $log.error("Error with Issues list: " + error);
            async.reject(error);
        });
        return async.promise;
    }
    
    function getNewIssues(status)
    {
        return new Issues({"issuesdate": new Date().toString("yyyy-MM-dd"),"roomN":"","issues":"","isSolved":false, "status": status});
    } 
    function getNewBilling(nextbilldate,status)
    {
        return new Billing({"date": nextbilldate, "ourside":"","hotelside":"", "status": status});
    } 

    return {
        getHotelsByUser: getHotelsByUser,
        getHotels: getHotels,
        getBillingInfoByHotelId: getBillingInfoByHotelId,
        getIssuesByHotelId: getIssuesByHotelId,
        getNewIssues: getNewIssues,
        getNewBilling: getNewBilling
    };
});