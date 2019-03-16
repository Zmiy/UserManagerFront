

var app = angular.module("userManagement",["ngRoute","ui.bootstrap", "ngAnimate", "ngTouch"]);

app.service("hotelParamSrv", function(){
    this.hotelParam = { };
    this.needSave=false;		
    //"hotelId": null, "year":moment().format("YYYY"), "month": moment().format("MMMM")
});

