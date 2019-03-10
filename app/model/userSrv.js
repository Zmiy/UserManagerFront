app.factory("userSrv", function($http, $q, $log) {

    var activeUser = null;

    function User(plainUser) {
        this.id = plainUser.id;
        this.name = plainUser.name;
        this.email = plainUser.email;
        this.role = plainUser.role;
    }

    function login(name, pwd) {
        var async = $q.defer();

        $http.get("http://localhost:56381/api/users").then(function(response) {
            var users = response.data;
            for (var i = 0; i < users.length; i++) {
                if (users[i].name === name && users[i].pwd === pwd) {
                    activeUser = new User(users[i]);
                    async.resolve(activeUser);

                }
            }

            if (!activeUser) {
                async.reject("");
            }
        }, function(error) {
            $log.error(error);
            async.reject(error);
        })

        return async.promise;
    }

    function isLoggedIn() {
        return activeUser ? true : false;
    }

    function logout() {
        activeUser = null;
    }

    function getActiveUser() {
        return activeUser;
    }

    return {
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout,
        getActiveUser: getActiveUser
    }

});