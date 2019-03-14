app.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl: "app/home/home.html"
    }).when('/login',{
        templateUrl: "app/login/login.html",
        controller: "loginCtrl"
    }).when("/loginModal",{
        templateUrl: "app/login/loginModal.html"
    }).when('/users',{
        templateUrl: "users.html",
        controller: "usersCtrl"
    }).when('/user/:role',{

    }).when("/currentuser/:id",{
        templateUrl: "app/users/currentuser.html",
        controller: "currentuserCtrl"
    }).when("/currentTech/:id",{

    }).otherwise({
        redirectTo: "/"
    });

});
