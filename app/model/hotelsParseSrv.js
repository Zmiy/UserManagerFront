app.factory("hotelsParseSrv", function ($http, $q, $log, userSrv) {
    function Hotel(hotel) {
        this.id = hotel.id;
        this.name = hotel.get("name");
        this.hotelObj = hotel;
    }

    function UserHotel(hoteluser) {
        this.hotelId = hoteluser.get("hotelId");
        this.userId = hoteluser.get("userId");
    }

    function Billing(parseBilling, status) {
        this.id = parseBilling.id;
        this.ourside = parseBilling.get("homibill");
        this.hotelside = parseBilling.get("hotelbill");
        this.billdate = moment(parseBilling.get("billdate"));
        this.status = parseBilling.status ? parseBilling.get("status") : status?status:"";
    }

    function Issues(parseIssues) {
        this.id = parseIssues.id;
        this.issuesdate = moment(parseIssues.get(date));
        this.roomN = parseIssues.get("roomN");
        this.issues = parseIssues.get("issues");
        this.isSolved = parseIssues.get("isSolved");
        this.techId = parseIssues.techId ? parseIssues.get("techId") : "";
        this.solvedDate = parseIssues.solvedDate ? moment(parseIssues.get("solvedDate")) : null;
        this.status = parseIssues.status ? parseIssues.get("status") : "";
    }

    var hotelsbyId = {};
    var hotels = [];
    function getHotelsByUser(id) {
        var async = $q.defer();
        var query = new Parse.Query("hotels");
        query.equalTo("users", Parse.User.current());
        query.find().then(function (results) {
            hotelsbyId[id] = [];
            for (var i = 0; i < results.length; i++) {
                hotelsbyId[id].push(new Hotel(results[i]));
            }
            async.resolve(hotelsbyId[id]);
            $log.info('HotelsUsers found', results);
        }, function (error) {
            $log.error("Error while fetching hotels by user " + error);
            async.reject(error);
        });
        
        return async.promise;
    }

    function getHotels() {
        var async = $q.defer();
        if (hotels.length > 0) {
            async.resolve(hotels);
        } else {
            $http.get("app/model/data/hotels.json").then(function (response) {
                jesonData = response.data;
                hotels = [];
                for (var i = 0; i < jesonData.length; i++) {
                    hotels.push(new Hotel(jesonData[i]));
                }
                async.resolve(hotels);
            }, function (error) {
                $log.error("Error with HotelsUsers: " + error);
                async.reject(error);
            });
        }

        // async.resolve(hotels.filter((hotel) => {
        //     return hu.map((huItem) => { huItem.hotelId === hotel.Id && huItem.userId === id })
        return async.promise;
    }

    function getBillingInfoByHotelId(hotelObj, year, month) {
        var async = $q.defer();
        //var billingByHotel = Parse.Object.extend('biling');
        var query = new Parse.Query("billing");
        //var obj = new billingByHotel();
        //obj.hotelId = hotelId;
        var hotelPointer = {
            "__type": 'Pointer',
            "className": 'hotels',
            "objectId": hotelObj.id
          };

          //{ "__type": "Pointer", "className": "hotels", "objectId": "<THE_REFERENCED_OBJECT_ID>" }  
        query.equalTo("hotelId", hotelPointer);
        query.ascending("billdate");
        dt = moment(year.toString()+" "+(month+1).toString(), 'YYYY MM');
        //var firstDay = dt.startOf('month');
        //var lastDay= dt.endOf('month');
        //var firstDay = moment(year+" "+month +" ", 'YYYY MMM', 'en').toISOString();
        //var d = new Date(year.toString()+"-" +"03-01T00:00:00.000Z");
        //var d1=new Date(month +" 01 "+year.toString()+"T00:00:00Z");
        query.greaterThanOrEqualTo("billdate", moment(dt.startOf('month').toISOString())._d);
        query.lessThanOrEqualTo("billdate",moment(dt.endOf('month').toISOString())._d);
        query.find().then(function(results){
            var billingInfo = [];
            results.forEach(function(el){billingInfo.push(new Billing(el));});
            async.resolve(billingInfo);
            
        }, function (error) {
            $log.error("Error while fetching billig info by hotelId " + error);
            async.reject(error);
        });
        
        
        // $http.get("app/model/data/billing.json").then(function (response) {
        //     jsonData = response.data;
        //     var billingInfo = [];
        //     //var firstDay = moment(year+" "+month, 'YYYY MMM', 'en');
        //     jsonData.filter(function (element) { return element.hotelId === hotelId; })
        //         .forEach(function (el) { billingInfo.push(new Billing(el)); });
        //     //billingInfo.forEach(el=>{console.log(el.date.format("MMMM","en") )})
        //     async.resolve(billingInfo.filter(function (el) { return el.billdate.format("MMMM", "en") === month; }));
        // }, function (error) {
        //     $log.error("Error with Billing: " + error);
        //     async.reject(error);
        // });
        return async.promise;
    }

    function getIssuesByHotelId(hotelId, year, month) {
        var async = $q.defer();
        $http.get("app/model/data/issues.json").then(function (response) {
            jsonData = response.data;
            var issuesList = [];
            jsonData.filter(function (element) { return element.hotelId === hotelId; })
                .forEach(function (el) { issuesList.push(new Issues(el)); });
            async.resolve(issuesList.filter(function (el) { return !el.isSolved; }));
        }, function (err) {
            $log.error("Error with Issues list: " + error);
            async.reject(error);
        });
        return async.promise;
    }

    function getNewIssues(status) {
        return new Issues({ "issuesdate": new Date().toString("yyyy-MM-dd"), "roomN": "", "issues": "", "isSolved": false, "status": status });
    }
    function getNewBilling(nextbilldate, status) {
        const billing = Parse.Object.extend('billing');
        const myNewObject = new billing();

        myNewObject.set('hotelbill', 0);
        myNewObject.set('homibill', 0);
        myNewObject.set('billdate', nextbilldate); 
        return new Billing(myNewObject,status);
        //return new Billing({ "date": nextbilldate, "ourside": "", "hotelside": "", "status": status });
    }

    function saveNewBilling(newObj,hotelObj){
        var async = $q.defer();
        const billing = Parse.Object.extend('billing');
        const myNewObject = new billing();
        var hotelPointer = {
            "__type": 'Pointer',
            "className": 'hotels',
            "objectId": hotelObj.id
          };

        myNewObject.set('hotelbill', parseFloat(newObj.hotelside));
        myNewObject.set('homibill', parseFloat(newObj.ourside));
        myNewObject.set('hotelId', hotelPointer);
        //var dt = newObj.billdate.toISOString();
        myNewObject.set('billdate', new Date(newObj.billdate._i)); 
        myNewObject.save().then(
            function(result)  {
               $log.info('billing created', result);
               async.resolve(result);
            },
            function(error) {
                $log.error('Error while creating billing: ', error);
                async.reject(error);
            }
          );
          return async.promise;
    }

    function updateBilling(updatingObj)
    {
        var billing = Parse.Object.extend('billing');
        var query = new Parse.Query(billing);
        // here you put the objectId that you want to update
        query.get(updatingObj.id).then(function(object){
          var async = $q.defer();  
          object.set('hotelbill', parseFloat(updatingObj.hotelside));
          object.set('homibill', parseFloat(updatingObj.ourside));
          //object.set('hotelId',hotelObj);
          object.save().then(function(result) {
            // You can use the "get" method to get the value of an attribute
            // Ex: response.get("<ATTRIBUTE_NAME>")
            
            $log.info('billing updated', result);
            async.resolve(true);
          }, function(error) {
                $log.error('Error while updating billing', error);
                async.reject(error);
          });
          return async.promise;
        });
       
    }


    return {
        getHotelsByUser: getHotelsByUser,
        getHotels: getHotels,
        getBillingInfoByHotelId: getBillingInfoByHotelId,
        getIssuesByHotelId: getIssuesByHotelId,
        getNewIssues: getNewIssues,
        getNewBilling: getNewBilling,
        saveNewBilling: saveNewBilling,
        updateBilling: updateBilling
    };
});