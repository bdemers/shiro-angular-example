(function () {
    'use strict';

    angular
        .module('shiroExample')
        .factory('TrooperService', TrooperService);

    TrooperService.$inject = ['$resource'];

    function TrooperService($resource) {
        var Trooper = $resource('/api/troopers/:id', {id: '@id'}, {
            'update': { method:'PUT' }
        });

        Trooper.list = function (callback) {
            Trooper.query(function (response) {
                var results = response;

                return callback(results);
            });
        };

        Trooper.getTrooper = function (id, callback) {
            Trooper.get(id, function (response) {
                var results = response;

                return callback(results);
            });
        };

        Trooper.addTrooper = function (trooper, callback) {
            var newTrooper = new Trooper({id: trooper.id, type: trooper.type, planetOfOrigin: trooper.planetOfOrigin, species: trooper.species });

            newTrooper.$save(callback);
        };

        return Trooper;
    }
})();