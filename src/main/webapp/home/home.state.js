(function () {
    'use strict';

    angular.module('shiroExample')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            });
    }
})();