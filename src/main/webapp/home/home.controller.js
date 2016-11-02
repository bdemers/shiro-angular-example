(function () {
    'use strict';

    angular
        .module('shiroExample')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['HomeService', '$scope'];

    function HomeController(HomeService, $scope) {

        HomeService.mod(function (response) {
            $scope.messageOfTheDay = response;
        });
    }
})();