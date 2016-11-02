(function () {
    'use strict';

    angular
        .module('shiroExample')
        .controller('TroopersController', TroopersController);

    TroopersController.$inject = ['TrooperService', '$scope'];

    function TroopersController(TrooperService, $scope) {

        var vm = this;

        TrooperService.list(function (response) {
            vm.troopers = response;
        });
    }
})();

angular
    .module('shiroExample')
    .controller('NewTrooperModal', function ($uibModal, $log, $document, $state, TrooperService) {

    var $trooperModal = this;

    $trooperModal.trooper = {};

    $trooperModal.open = function () {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'newTrooperModal.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$trooperModal',
            resolve: {
                trooper: function () {
                    return $trooperModal.trooper;
                }
            }
        });

        modalInstance.result.then(
            function save(trooper) {
                TrooperService.addTrooper(trooper, function () {
                    $log.info('Modal saved for trooper: ' + trooper);
                    $state.go('viewTrooper', {id: trooper.id});
                });
            },
            function cancel() {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular
    .module('shiroExample')
    .controller('ModalInstanceCtrl', function ($uibModalInstance, trooper) {

    var $trooperModal = this;
    $trooperModal.trooper = trooper;

    $trooperModal.save = function () {
        $uibModalInstance.close($trooperModal.trooper);
    };

    $trooperModal.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

angular
    .module('shiroExample')
    .component('newTrooperModal', {

        templateUrl: 'newTrooperModal.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function () {
            var $trooperModal = this;

            $trooperModal.$onInit = function () {
                $trooperModal.trooper = $trooperModal.resolve.trooper;
            };

            $trooperModal.ok = function () {
                $trooperModal.close({$value: $trooperModal.trooper});
            };

            $trooperModal.cancel = function () {
                $trooperModal.dismiss({$value: 'cancel'});
            };
        }
});