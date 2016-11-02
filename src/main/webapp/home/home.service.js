(function () {
    'use strict';

    angular
        .module('shiroExample')
        .factory('HomeService', HomeService);

    HomeService.$inject = ['$resource'];

    function HomeService($resource) {
        var Home = $resource('/api/welcome');

        Home.mod = function (callback) {
            Home.get(function (response) {
                var results = response.messageOfTheDay;

                return callback(results);
            });
        };

        return Home;
    }
})();