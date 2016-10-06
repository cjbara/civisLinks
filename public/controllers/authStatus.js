angular.module('authStatus', [])
    .service('authStatus', function () {
        var user = undefined;

        return {
            getUser: function () {
                return user;
            },
            setUser: function(value) {
                user = value;
                console.dir(user);
            }
        };
    });