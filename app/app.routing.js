app.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl: "app/home/home.html"
    }).when('/login',{

    }).when('/users',{
        templateUrl: "users.html",
        controller: "usersCtrl"
    }).when('/user/role',{

    }).otherwise({
        redirectTo: "/"
    });

});
