app.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl: "app/home/home.html"
    }).when('/login',{
        templateUrl: "app/login/login.html",
        controller: "loginCtrl"
    }).when('/users',{
        templateUrl: "users.html",
        controller: "usersCtrl"
    }).when('/user/:role',{

    }).when("/currentuser/:id",{

    }).when("/currentTech/:id",{

    }).otherwise({
        redirectTo: "/"
    });

});
