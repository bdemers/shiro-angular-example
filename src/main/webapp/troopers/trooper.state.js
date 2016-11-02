(function () {
    'use strict';

    angular.module('shiroExample')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('troopers', {
                url: '/troopers',
                templateUrl: 'troopers/troopers-list.html',
                controller: 'TroopersController',
                controllerAs: 'vm'
            })
            .state('viewTrooper', {
                url: '/troopers/:id/view',
                templateUrl: 'troopers/trooper.html',
                controller: 'TrooperController',
                controllerAs: 'vm'
            });
    }
})();