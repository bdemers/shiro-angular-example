(function () {
    'use strict';

    angular
        .module('shiroExample')
        .factory('permissionsService', function ($http) {

            var permissionService = {
                get: function() {
                    var promise = $http.get('/api/permissions').then(function (response) {
                        return response.data;
                    });
                    // Return the promise to the controller
                    return promise;
                }
            };

            return permissionService;
    })

})();