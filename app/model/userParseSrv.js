app.factory("userParseSrv", function ($http, $q, $log) {

    var activeUser = null;

    function User(plainUser) {
        this.id = plainUser.id;//plainUser.get(id);
        this.name = plainUser.get("username");
        this.email = plainUser.get("email");
        this.role = plainUser.get("role");
    }

    function login(email, pwd) {
        var async = $q.defer();


        // Pass the username and password to logIn function
        Parse.User.logIn(email, pwd).then(function(user) {
            // Do stuff after successful login
            $log.info('Logged in user', user);
            activeUser = new User(user);
            async.resolve(activeUser);
        }).catch(function(error) {
            $log.error('Error while logging in user', error);
            async.reject(error);
        });

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
};

});